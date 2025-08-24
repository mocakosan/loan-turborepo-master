import { NextResponse } from "next/server";
import { verify } from "argon2";
import { prisma } from "@repo/db";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const admin = await prisma.admin
      .findUniqueOrThrow({
        where: {
          email,
        },
      })
      .catch((error) => {
        console.error(error);
        return null;
      });

    if (!admin) {
      throw new Error("존재하지 않는 계정입니다.");
    }

    const isVerifyPassword = await verify(admin.password, password);
    if (!isVerifyPassword) {
      throw new Error("비밀번호가 올바르지 않습니다.");
    }

    return NextResponse.json({ admin }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    } else {
      return NextResponse.json({ message: error }, { status: 400 });
    }
  }
}
