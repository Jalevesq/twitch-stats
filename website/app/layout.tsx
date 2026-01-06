import { Archivo_Black, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/app/_components/ui/sonner";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${archivoBlack.variable} font-sans bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a] to-[#1a0a2e] text-white min-h-screen flex flex-col overflow-x-hidden`}
      >
        <header className="relative px-12 py-8 border-b border-[rgba(255,255,255,0.08)] backdrop-blur-xl z-10">
          <div className="font-display text-2xl tracking-tight flex items-center gap-2 animate-fadeInDown">
            <div className="w-8 h-8 bg-gradient-to-br from-[#7c3aed] via-[#9146ff] to-[#ec4899] rounded-lg flex items-center justify-center text-xl shadow-lg shadow-purple-500/20">
              ⚡
            </div>
            <span>StreamHub</span>
          </div>
        </header>
        <Toaster richColors />
        {children}
      </body>
    </html>
  );
}
