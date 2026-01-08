import { Archivo_Black, DM_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/app/_components/Header";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/app/_server/auth";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-archivo-black",
});

export const metadata: Metadata = {
  title: "StreamHub",
  description: "Stream smarter with real-time analytics",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${archivoBlack.variable} font-sans bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a] to-[#1a0a2e] text-white min-h-screen flex flex-col overflow-x-hidden`}
      >
        <Toaster richColors />
        <SessionProvider session={session}>
          <Header session={session} />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
