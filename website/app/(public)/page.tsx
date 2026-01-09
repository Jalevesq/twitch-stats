"use client";

import FeatureSection from "@/app/_components/FeatureSection";
import TwitchAuthSection from "@/app/_components/TwitchAuthSection";
import Footer from "@/app/_components/Footer";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Home() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      if (error === "OAuthCallbackError") {
        toast.error("Login was cancelled");
      } else if (error === "access_denied") {
        toast.error("You denied the access.");
      } else if(error === "not_logged") {
        toast.warning("You are not logged in!");
      } else {
        toast.error("Login failed");
      }
      window.history.replaceState({}, "", "/");
    }
  }, [error]);
  return (
    <>
      <main className="flex-1 flex items-center justify-center px-8 py-12 relative">
        <div className="max-w-2xl text-center animate-fadeInUp">
          <h1 className="font-display text-[clamp(2.5rem,8vw,4.5rem)] leading-[1.2] mb-6 tracking-tight bg-gradient-to-br from-white to-text-secondary bg-clip-text text-transparent pb-2">
            Connect your stream, grow your community
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed mb-12 font-normal">
            Join thousands of creators building authentic connections with their
            audience. Start streaming smarter today.
          </p>

          <TwitchAuthSection />
          <FeatureSection />
        </div>
      </main>
      <Footer />
    </>
  );
}
