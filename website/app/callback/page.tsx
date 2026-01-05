"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {exchangeTwitchToken} from "@/app/callback/_server/exchangeTwitchToken";

export default function Callback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    // Check if user denied access
    if (error) {
      console.error(errorDescription);
      localStorage.setItem(
        "auth_error",
        "Authentication failed, please try again later",
      );
      router.push("/");
      return;
    }

    // Verify state parameter
    const storedState = localStorage.getItem("twitch_oauth_state");
    const storedTimestamp = localStorage.getItem("twitch_oauth_timestamp");

    if (!storedState || !state || storedState !== state) {
      localStorage.removeItem("twitch_oauth_state");
      localStorage.removeItem("twitch_oauth_timestamp");
      localStorage.setItem(
        "auth_error",
        "Invalid state parameter. Possible CSRF attack detected.",
      );
      router.push("/");
      return;
    }

    // Check if state is stale (older than 10 minutes)
    if (storedTimestamp) {
      const age = Date.now() - parseInt(storedTimestamp);
      if (age > 10 * 60 * 1000) {
        localStorage.removeItem("twitch_oauth_state");
        localStorage.removeItem("twitch_oauth_timestamp");
        localStorage.setItem(
          "auth_error",
          "Authentication session expired. Please try again.",
        );
        router.push("/");
        return;
      }
    }

    // Clean up localStorage after successful validation
    localStorage.removeItem("twitch_oauth_state");
    localStorage.removeItem("twitch_oauth_timestamp");

    if (!code) {
      localStorage.setItem(
        "auth_error",
        "No authorization code received, please try again later.",
      );
      router.push("/");
      return;
    }

    const handleTokenExchange = async () => {
        console.log("HERE !")
      try {
        const result = await exchangeTwitchToken(code);
        console.log(JSON.stringify(result));
        // Success - redirect to dashboard
        router.push("/");
      } catch (error) {
        console.error("Token exchange error:", error);
        localStorage.setItem(
          "auth_error",
          error instanceof Error
            ? error.message
            : "Authentication failed, please try again later",
        );
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
