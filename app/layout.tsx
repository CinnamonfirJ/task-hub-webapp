import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import { Providers } from "@/lib/query/provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const instrument = localFont({
  src: "../public/assets/font/InstrumentSerif-Italic.ttf",
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  title: "TaskHub - Earn with us",
  description: "Connect with tasks and earn money with TaskHub.",
};

import { GoogleOAuthProvider } from "@react-oauth/google";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <html lang='en' className="scroll-smooth">
      <body className={`antialiased ${inter.variable} ${instrument.variable}`}>
        <GoogleOAuthProvider clientId={googleClientId}>
          <Providers>{children}</Providers>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}

