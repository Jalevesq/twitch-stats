import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/app/_lib/prisma";
import NextAuth from "next-auth";
import Twitch from "next-auth/providers/twitch";

const AUTHORIZED_USERS: String[] = process.env.AUTHORIZED_USERS!.split(",");

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Twitch({
      clientId: process.env.TWITCH_CLIENT_ID!,
      clientSecret: process.env.TWITCH_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: `${process.env.TWITCH_SCOPES}`,
        },
      },
    }),

  ],
  pages: {
    signIn: "/",
    error: "/",
  },
  callbacks: {
    async signIn({ user, profile }) {
      if (!AUTHORIZED_USERS.includes(profile?.sub as string)) {
        return false;
      }
      await prisma.user.updateMany({
        where: { id: user.id },
        data: { isValid: true },
      });
      return true;
    },
    async session({ session, user }) {
        const account = await prisma.account.findFirst({
            where: {
                userId: user.id,
                provider: 'twitch'
            },
            select: { providerAccountId: true },
        });
        const twitchId = account?.providerAccountId;
        if (!AUTHORIZED_USERS.includes(twitchId!) || !user.isValid) {
            await prisma.session.deleteMany({ where: { userId: user.id } });
            return null as any;
        }
      return session;
    },
  },
});
