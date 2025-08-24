import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@repo/db";

import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const adminAuthOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "admin-credentials",
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(
          `${process.env.NEXTAUTH_URL}/admin/api/auth/admin/sign-in`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          }
        );

        const data = await res.json();

        if (data?.message) {
          throw new Error(data.message);
        }

        if (!data?.admin) {
          throw new Error("로그인을 실패했습니다.");
        }

        return data.admin;
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 24시간
  },
  callbacks: {
    jwt({ token }) {
      token.role = "admin";

      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub!;
      session.user.role = token.role;

      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  cookies: {
    sessionToken: {
      name: "next-auth.admin.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: false, // TODO: HTTPS에서만 사용 (개발 시 false)
      },
    },
  },
};

export default adminAuthOptions;
