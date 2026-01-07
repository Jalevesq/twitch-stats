import { Archivo_Black, DM_Sans } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/app/_context/session-context";
import { Header } from "@/app/_components/Header";
import { ReactNode } from "react";
import { getSession } from "@/app/_lib/session";
import { Toaster } from "sonner";
import Footer from "@/app/_components/Footer";
import {Metadata} from "next";

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
    title: 'StreamHub',
    description: 'Stream smarter with real-time analytics',
};


export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${archivoBlack.variable} font-sans bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a] to-[#1a0a2e] text-white min-h-screen flex flex-col overflow-x-hidden`}
      >
        <Toaster richColors />
        <SessionProvider session={session}>
          <Header user={session?.user} />
          {children}
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
