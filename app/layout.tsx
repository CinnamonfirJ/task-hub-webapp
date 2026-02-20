import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/query/provider";

export const metadata: Metadata = {
  title: "TaskHub - Earn with us",
  description: "Connect with tasks and earn money with TaskHub.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='antialiased font-sans'>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
