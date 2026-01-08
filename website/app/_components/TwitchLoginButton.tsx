"use client";

import { signIn } from "next-auth/react";

export default function TwitchLoginButton() {
  return (
    <button
      className="group relative inline-flex items-center justify-center gap-3 px-12 py-5 text-lg font-semibold bg-[#9146ff] text-white border-none rounded-xl cursor-pointer transition-all duration-300 ease-out overflow-hidden hover:bg-[#772ce8] hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(145,70,255,0.4)] active:translate-y-0"
      onClick={() =>
        signIn("twitch", { redirectTo: "/dashboard", redirect: true })
      }
    >
      <span className="absolute inset-0 bg-gradient-to-br from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
      <svg
        className="w-6 h-6 fill-current relative z-10"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
      </svg>
      <span className="relative z-10">Sign in with Twitch</span>
    </button>
  );
}
