"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { exchangeTwitchToken } from "@/app/_server/auth";

export default function Callback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error === "access_denied") {
      toast.error("Access Denied");
      router.push("/");
      return;
    }

    if (!code || !state) {
      toast.error("Invalid authentication");
      router.push("/");
      return;
    }

    exchangeTwitchToken(code, state)
      .then(() => {
        router.push("/dashboard");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Authentication failed");
        router.push("/");
      })
      .finally(() => {
        setIsProcessing(false);
      });
  }, [searchParams, router]);

  if (!isProcessing) return null;

  return (
    <main className="flex-1 flex items-center justify-center px-8 py-12">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <h1 className="text-2xl font-display mb-4">Authenticating...</h1>
        <p className="text-text-secondary">
          Please wait while we complete your authentication
        </p>
      </div>
    </main>
  );
}
