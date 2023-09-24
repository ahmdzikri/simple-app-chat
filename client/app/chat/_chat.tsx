"use client";

import {
  Center,
  HStack,
  Stack,
  Text,
  VStack,
  IconButton,
  Textarea,
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
    token: string;
  };
}

export const Chat: React.FC<Props> = ({ cookies }) => {
  const { register, handleSubmit, reset, formState } = useForm();
  const [messages, setMessages] = useState<Message[]>([]);
  const [guids, setGuid] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ws = new WebSocket(
      "wss://simple-app-chat-production.up.railway.app/cable/"
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

  const onSubmit = async (data: any) => {
    await sendMessage(data.messages, cookies.userName);
    reset(); 
  };
  const commentEnterSubmit = (e: any) => {
    if (e.key === "Enter" && e.shiftKey == false) {
      e.preventDefault();
      handleSubmit((data) => {
        onSubmit(data);
        reset(); 
      })();
    }
  };

  const fetchMessages = async () => {
    const response = await fetch(
      "https://simple-app-chat-production.up.railway.app/messages"
    );
    const data = await response.json();
    setMessagesAndScrollDown(data);
  };

  const setMessagesAndScrollDown = (data: any) => {
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
    <Center bg="#444654" w="100%" minH="100vh">
      <Stack w="100vw" h="100vh" spacing={0}>
        <Stack textAlign="center" my={4} py={4}>
          <Text as="h1" fontSize="2xl" color="white">
            Hi, {cookies.userName}
          </Text>
        </Stack>
        <Stack
          h="100vh"
          overflowY="auto"
          width="auto"
          rounded={2}
          mx={{base:0, md:20}}
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
        <VStack spacing={0} w="100%">
          <HStack bg="#343542" p={4} borderRadius="md" width="100%">
            <Textarea
              variant="unstyled"
              py={2}
              px={3}
              my={4}
              mx={2}
              width="100%"
              minH="2px"
              placeholder="Send a message"
              borderColor="transparent"
              focusBorderColor="transparent"
              _placeholder={{ color: "#6C6C7C" }}
              color="white"
              bg="#40414F"
              autoComplete="off"
              resize="none"
              onKeyDown={commentEnterSubmit}
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
