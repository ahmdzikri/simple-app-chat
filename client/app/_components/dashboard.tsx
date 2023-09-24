"use client";

import {
  Button,
  Center,
  Text,
  VStack,
  Input,
} from "@chakra-ui/react";
import React from "react";
import { startChat } from "../action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export const Dashboard = () => {
  const router = useRouter();
  const { register, handleSubmit, watch } = useForm({
    mode: "all",
    defaultValues: {
      userName: "",
    },
  });
  const userName = watch("userName").trim();

  return (
    <Center h="100vh" bg="#00002E">
      <form
        onSubmit={handleSubmit((data) => {
          toast.promise(() => startChat(data.userName), {
            loading: "Loading...",
            success: ({ msg, err }: { msg: string; err: Error }) => {
              if (err) throw err;
              setTimeout(() => {
                router.push("/chat");
              }, 1000);
              return msg;
            },
            error: (err: Error) => {
              return err.message ?? err;
            },
            finally: () => {},
          });
        })}
      >
        <VStack spacing={10}>
          <Text as="h1" fontSize="8xl" fontWeight={700} color="#D292FF">
            Welcome !
          </Text>
          <VStack w="100%" align="center">
            <Input
              {...register("userName")}
              type="text"
              focusBorderColor="transparent"
              borderColor="transparent"
              placeholder="Enter Your Name"
              _placeholder={{ color: "#6C6C7C" }}
              size="lg"
              bg="white"
              required
            />
            <Button
              bg="#3C46FF"
              _hover={{ bg: "#0000FF" }}
              color="white"
              size="lg"
              mt="4"
              type="submit"
              isDisabled={!userName}
            >
              Start Chat
            </Button>
          </VStack>
        </VStack>
      </form>
    </Center>
  );
};
