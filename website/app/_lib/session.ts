import {cookies} from "next/headers";
import prisma from "@/app/_lib/prisma";

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
const RENEWAL_THRESHOLD = 1 * 24 * 60 * 60 * 1000; // 1 day

export async function getSession() {
    const sessionId = (await cookies()).get('session_id')?.value;
    if (!sessionId) return null;

    const session = await prisma.session.findFirst({
        where: {
            id: sessionId,
            expiresAt: { gt: new Date() },
        },
        include: { user: true },
    });

    if (!session) return null;

    // Renew if at least 1 day old
    const sessionAge = Date.now() - session.createdAt.getTime();
    if (sessionAge > RENEWAL_THRESHOLD) {
        const newExpiry = new Date(Date.now() + SESSION_DURATION);

        await prisma.session.update({
            where: { id: session.id },
            data: {
                expiresAt: newExpiry,
                createdAt: new Date(), // Reset the age
            },
        });

        (await cookies()).set('session_id', session.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: SESSION_DURATION / 1000,
        });
    }

    return session;
}

export async function createSession(userId: string) {
    const session = await prisma.session.create({
        data: {
            userId,  // This is the Twitch ID
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
    });

    (await cookies()).set('session_id', session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60,
    });
}