import NextAuth, { type NextAuthOptions } from "next-auth";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { id } = credentials as {
          id: string;
        };

        const user = await prisma.user.findUnique({
          where: { id },
        });

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/*",
  },
};

export default NextAuth(authOptions);
