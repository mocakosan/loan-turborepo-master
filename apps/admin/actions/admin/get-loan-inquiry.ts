"use server";

import { Prisma, prisma } from "@repo/db";

export type GetLoanInquiry = Prisma.PromiseReturnType<typeof getLoanInquiry>;

export async function getLoanInquiry(id: number) {
  try {
    const loanInquiry = await prisma.loanInquiry.findUnique({
      where: { id },
      select: {
        title: true,
        name: true,
        regionKind: {
          select: {
            id: true,
            name: true,
          },
        },
        isJob: true,
        age: true,
        loanKind: {
          select: {
            id: true,
            name: true,
          },
        },
        gender: true,
        createdAt: true,
        content: true,
      },
    });

    return loanInquiry;
  } catch (error) {
    console.error(error);
    return null;
  }
}
