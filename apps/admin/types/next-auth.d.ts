import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  // interface User extends DefaultUser {
  //   nickname: string;
  // }
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: string;
  }
}

declare module "@next-auth/prisma-adapter" {
  declare function PrismaAdapter(p: any): Adapter;
}
