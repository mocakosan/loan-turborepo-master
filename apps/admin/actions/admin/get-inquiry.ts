"use server";

import { Prisma, prisma } from "@repo/db";

export type GetInquiry = Prisma.PromiseReturnType<typeof getInquiry>;

export async function getInquiry(id: number) {
  try {
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      select: {
        title: true,
        inquiryKind: true,
        phoneNumber: true,
        name: true,
        content: true,
        reply: true,
        createdAt: true,
      },
    });

    return inquiry;
  } catch (error) {
    console.error(error);
    return null;
  }
}
