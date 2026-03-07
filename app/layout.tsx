import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "@/lib/query/provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

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
      <body className={`antialiased ${inter.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
