"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import * as React from "react";
import { Toaster } from "sonner";


interface Props {
  children?: React.ReactNode;
}

export function Providers({ children }: Props) {
  return (
    <CacheProvider>
      <ChakraProvider>
      <Toaster expand={true} richColors closeButton />
        {children}
      </ChakraProvider>
    </CacheProvider>
  );
}