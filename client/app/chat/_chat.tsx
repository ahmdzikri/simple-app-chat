"use client";

import {
  Center,
  HStack,
  Stack,
  Text,
  VStack,
  Input,
  IconButton,
} from "@chakra-ui/react";
import { RiSendPlane2Fill } from "react-icons/ri";
import React, { useState, useEffect, useRef } from "react";
import { sendMessage } from "./action";
import { useForm } from "react-hook-form";

interface Message {
  id: string;
  name: string;
  body: string;
}
interface Props {
  cookies: {
    userName: string;
    token: string
  };
}

export const Chat: React.FC<Props> = ({ cookies }) => {
  const { register, handleSubmit, reset, formState } = useForm();
  const [messages, setMessages] = useState<Message[]>([]);
  const [guids, setGuid] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ws = new WebSocket(
      "wss://simple-chat-production-b153.up.railway.app/cable/"
    );
    ws.onopen = () => {
      console.log("Connected to websocket server");
      setGuid(cookies.token);

      ws.send(
        JSON.stringify({
          command: "subscribe",
          identifier: JSON.stringify({
            id: guids,
            channel: "MessagesChannel",
          }),
        })
      );
    };
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "ping") return;
      if (data.type === "welcome") return;
      if (data.type === "confirm_subscription") return;

      const message = data.message;
      setMessages((prevMessages) => [...prevMessages, message]);
    };
    return () => {
      ws.close(); 
    };
  }, []);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    resetScroll();
  }, [messages]);

  const onSubmit = async (data) => {
    await sendMessage(data.messages, cookies.userName);
    reset(); // Mengosongkan input setelah mengirim pesan
  };

  const fetchMessages = async () => {
    const response = await fetch(
      "https://simple-chat-production-b153.up.railway.app/messages"
    );
    const data = await response.json();
    setMessagesAndScrollDown(data);
  };

  const setMessagesAndScrollDown = (data) => {
    setMessages(data);
    resetScroll();
  };

  const resetScroll = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  return (
    <Center minH="100vh" bg="#444654">
      <Stack w={{ base: "100vw", lg: "7xl" }} py={8} px={4} spacing={0}>
        <Stack textAlign="center" mb={4}>
          <Text as="h1" fontSize="2xl" color="white">
            Hi, {cookies.userName}
          </Text>
        </Stack>
        <Stack
          maxH={{ base: "full", md: "400px" }}
          overflowY="scroll"
          width="auto"
          rounded={2}
          py={10}
          px={6}
          spacing={4}
          ref={messagesContainerRef}
          sx={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {messages.map((message) => (
            <Stack
              key={message.id}
              alignItems={
                message.name === cookies.userName ? "flex-end" : "flex-start"
              }
            >
              <SessionCard
                name={message.name === cookies.userName ? "" : message.name}
                bodyText={message.body}
              />
            </Stack>
          ))}
        </Stack>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={0}>
            <HStack
              bg="#343542"
              p={4}
              borderRadius="md"
              width="100%"
              maxH="400px"
              overflowY="auto"
            >
              <Input
                variant="unstyled"
                py={2}
                px={3}
                my={4}
                mx={2}
                type="text"
                placeholder="Send a message"
                borderColor="transparent"
                focusBorderColor="transparent"
                _placeholder={{ color: "#6C6C7C" }}
                color="white"
                bg="#40414F"
                autoComplete="off"
                {...register("messages", {
                  validate: (value) => value.trim().length > 0,
                })}
              />
              <IconButton
                type="submit"
                colorScheme="teal"
                aria-label="Send message"
                icon={<RiSendPlane2Fill />}
                isDisabled={!formState.isValid}
              />
            </HStack>
          </VStack>
        </form>
      </Stack>
    </Center>
  );
};
const SessionCard = ({
  name,
  bodyText,
}: {
  name: string;
  bodyText: string;
}) => {
  return (
    <Stack
      maxW={{ base: "xs", md: "lg" }}
      bg="#1d262b"
      spacing={4}
      borderRadius="md"
      pt={1.5}
      px={2}
      pb={2}
      boxShadow="md"
      color="white"
    >
      <Stack gap={1}>
        <Text fontSize={{ base: "11px", md: "12px" }} color="#ADFF2F">
          <b> {name} </b>
        </Text>
        <Text fontSize={{ base: "13px", md: "14px" }}>{bodyText}</Text>
      </Stack>
    </Stack>
  );
};
