"use client";

import {
  Button,
  Heading,
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
import { sendMessage } from "../action";


interface Message {
  id: string;
  name: string;
  body: string;
}
interface Props {
  name: string;
}

export const Dashboard: React.FC<Props> = ({ name }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [guids, setGuid] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000/cable/");
    ws.onopen = () => {
      console.log("Connected to websocket server");
      setGuid(name);

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
      ws.close(); // Tutup WebSocket ketika komponen unmount
    };
  }, []);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    resetScroll();
  }, [messages]);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const messageInput = e.currentTarget.querySelector('[name="messages"]');
    const body = messageInput ? (messageInput as HTMLInputElement).value : "";
    (messageInput as HTMLInputElement).value = "";

    await sendMessage(body, name);
  };

  const fetchMessages = async () => {
    const response = await fetch("http://localhost:3000/messages");
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
    <Center maxH="100vh">
      <Stack w={{ base: "100vw", lg: "7xl" }} py={8} px={4} spacing={4}>
        <Stack textAlign="center">
          <Heading size="lg" color="white.500">
            Chat App
          </Heading>
          <Text as="p" fontSize="9px" color="white">
            Guid: {name}
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
        >
          {messages.map((message) => (
            <Stack
              key={message.id}
              alignItems={message.name === name ? "flex-end" : "flex-start"}              
            >
              <SessionCard guid={message.name === name ? "" : message.name} bodyText={message.body} />
            </Stack>
          ))}
        </Stack>
        <form onSubmit={handleSubmit}>
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
                name="messages"
                type="text"
                placeholder="Send a message"
                borderColor="transparent"
                focusBorderColor="transparent"
                _placeholder={{ color: "#6C6C7C" }}
                color="white"
                bg="#40414F"
              />
              <IconButton
                type="submit"
                colorScheme="teal"
                aria-label="Send message"
                icon={<RiSendPlane2Fill />}
              />
            </HStack>
          </VStack>
        </form>
      </Stack>
    </Center>
  );
};
const SessionCard = ({
  guid,
  bodyText,
}: {
  guid: string;
  bodyText: string;
}) => {
  return (
    <Stack
      maxW={{ base: "xs" }}
      bg="#202C33"
      spacing={4}
      borderRadius="md"
      pt={1.5}
      px={2}
      pb={2}
      boxShadow="md"
    >
      <Stack gap={1}>
        <Text fontSize={{ base: "9px", md: "14px" }}>
          <b> {guid} </b>
        </Text>
        <Text fontSize={{ base: "9px", md: "14px" }}>{bodyText}</Text>
      </Stack>
    </Stack>
  );
};
