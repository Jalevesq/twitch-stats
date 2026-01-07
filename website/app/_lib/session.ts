import { cookies } from "next/headers";
import prisma from "@/app/_lib/prisma";
import { Session } from "@/app/_types/session";

const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days
const RENEWAL_THRESHOLD = 1 * 24 * 60 * 60 * 1000; // 1 day

export async function getSession(): Promise<Session | null> {
  const sessionId = (await cookies()).get("session_id")?.value;
  if (!sessionId) return null;

  const session = await prisma.session.findFirst({
    where: {
      id: sessionId,
      expiresAt: { gt: new Date() },
    },
    select: {
      id: true,
      createdAt: true,
      expiresAt: true,
      user: {
        select: {
          id: true,
          login: true,
          displayName: true,
          profileImage: true,
        },
      },
    },
  });

  if (!session) return null;

  const sessionAge = Date.now() - session.createdAt.getTime();
  if (sessionAge > RENEWAL_THRESHOLD) {
    const newExpiry = new Date(Date.now() + SESSION_DURATION);

    await prisma.session.update({
      where: { id: session.id },
      data: {
        expiresAt: newExpiry,
        createdAt: new Date(),
      },
    });

    (await cookies()).set("session_id", session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION / 1000,
    });
  }

  return {
    id: session.id,
    user: session.user,
  };
}

export async function createSession(userId: string) {
  const session = await prisma.session.create({
    data: {
      userId,
      expiresAt: new Date(Date.now() + SESSION_DURATION),
    },
  });

  (await cookies()).set("session_id", session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION / 1000,
  });
}
