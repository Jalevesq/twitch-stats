"use client";

import { useRequiredSession } from "@/app/_context/session-context";

export default function Dashboard() {
  const session = useRequiredSession();

  return (
    <main className="flex-1 px-12 py-8">
      <h1 className="text-3xl font-display mb-4">Welcome, {session.user.displayName}!</h1>
      <p className="text-text-secondary">This is your dashboard.</p>
    </main>
  );
}
