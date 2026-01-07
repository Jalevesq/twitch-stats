"use client";

import { ReactNode, useEffect } from "react";
import { useSession } from "@/app/_context/session-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      toast.warning("You are not logged in!");
      router.push("/");
    }
  }, [session, router]);

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
