import "./globals.css"
import { Noto_Sans } from "next/font/google";
import { Providers } from "./providers";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat App',
}

const font = Noto_Sans({ subsets: ["latin"], weight:['400','700'] });



export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${font.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}