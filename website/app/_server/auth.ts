import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/app/_lib/prisma";
import NextAuth from "next-auth";
import Twitch from "next-auth/providers/twitch";

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
    async signIn({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { isValid: true },
      });
      return true;
    },
    async session({ session, user }) {
      if (!user.isValid) {
        await prisma.session.deleteMany({ where: { userId: user.id } });
        return null as any;
      }
      session.user.isValid = user.isValid;
      return session;
    },
  },
});
