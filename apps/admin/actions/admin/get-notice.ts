"use server";

import { Prisma, prisma } from "@repo/db";

export type GetNotice = Prisma.PromiseReturnType<typeof getNotice>;

export async function getNotice(id: number) {
  try {
    const notice = await prisma.notice.findUnique({
      where: { id },
      select: {
        title: true,
        content: true,
      },
    });

    return notice;
  } catch (error) {
    console.error(error);
    return null;
  }
}
