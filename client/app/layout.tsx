import { Noto_Sans } from "next/font/google";
import { Providers } from "./providers";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Simple Chat',
  description: "The Simple Chat App is an exceedingly elementary messaging application designed with utmost simplicity in mind. This minimalistic app serves as an ideal introduction for those looking to explore the very basics of real-time communication through text messages."
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