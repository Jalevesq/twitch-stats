"use client";

import { useSession } from "@/app/_context/session-context";
import Link from "next/link";
import TwitchLoginButton from "@/app/_components/TwitchLoginButton";

export default function TwitchAuthSection() {
  const session = useSession();

  return (
    <div className="flex flex-col items-center gap-6">
      {session ? (
        <Link
          href="/dashboard"
          className="group relative inline-flex items-center justify-center gap-3 px-12 py-5 text-lg font-semibold bg-[#9146ff] text-white border-none rounded-xl cursor-pointer transition-all duration-300 ease-out overflow-hidden hover:bg-[#772ce8] hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(145,70,255,0.3)]"
        >
          Go to Dashboard
        </Link>
      ) : (
        <TwitchLoginButton />
      )}
      <a
        href="#"
        className="text-text-secondary no-underline text-base transition-colors duration-300 relative pb-0.5 hover:text-text-primary after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-text-primary after:transition-all after:duration-300 hover:after:w-full"
      >
        Learn more
      </a>
    </div>
  );
}
