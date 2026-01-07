"use client";

import { createContext, ReactNode, useContext } from "react";
import { Session } from "@/app/_types/session";

type SessionContextType = {
  session: Session | null;
};

const SessionContext = createContext<SessionContextType | null>({
  session: null,
});

export function SessionProvider({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  return (
    <SessionContext.Provider value={{ session }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): Session | null {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }

  return context.session;
}

export function useRequiredSession(): Session {
  const context = useContext(SessionContext);

  if (!context || !context.session) {
    throw new Error(
      "useSession must be used within SessionProvider AND with a user",
    );
  }

  return context.session!;
}
