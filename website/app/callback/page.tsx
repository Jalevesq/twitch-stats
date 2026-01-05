"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {exchangeTwitchToken} from "@/app/callback/_server/exchangeTwitchToken";
import {toast} from "sonner";

export default function Callback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error == 'access_denied') {
      toast.error("Access Denied", {description: "You denied access. If this is a mistake, please try again."});
      router.push("/");
      return;
    } else if (error) {
        toast.error("Authentication error. Please try again later.");
        router.push("/");
        return;
    }

    const storedState = localStorage.getItem("twitch_oauth_state");
    const storedTimestamp = localStorage.getItem("twitch_oauth_timestamp");

    if (!storedState || !state || storedState !== state) {
      localStorage.removeItem("twitch_oauth_state");
      localStorage.removeItem("twitch_oauth_timestamp");
      toast.error("Invalid state parameter. Possible CSRF attack detected.")
      router.push("/");
      return;
    }

    if (storedTimestamp) {
      const age = Date.now() - parseInt(storedTimestamp);
      if (age > 1 * 60 * 1000) {
        localStorage.removeItem("twitch_oauth_state");
        localStorage.removeItem("twitch_oauth_timestamp");
        toast.error("Invalid Authentication. 10 minutes delay passed.")
        router.push("/");
        return;
      }
    }

    localStorage.removeItem("twitch_oauth_state");
    localStorage.removeItem("twitch_oauth_timestamp");

    if (!code) {
      toast.error("Invalid Authentication. No code.")
      router.push("/");
      return;
    }

    const handleTokenExchange = async () => {
      try {
        const result = await exchangeTwitchToken(code);
        router.push("/dashboard");
      } catch (error) {
        console.error("Token exchange error:", error);
        toast.error("Authentication failed. Contact us if the error persist.");
        router.push("/");
      } finally {
        setIsProcessing(false);
      }
    };

    handleTokenExchange();
  }, [searchParams, router]);

  return (
    <main className="flex-1 flex items-center justify-center px-8 py-12">
      {isProcessing && (
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <h1 className="text-2xl font-display mb-4">Authenticating...</h1>
          <p className="text-text-secondary">
            Please wait while we complete your authentication
          </p>
        </div>
      )}
    </main>
  );
}
