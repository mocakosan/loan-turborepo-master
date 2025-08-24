"use server";

import { Prisma, prisma } from "@repo/db";

export type GetLoanKinds = Prisma.PromiseReturnType<typeof getLoanKinds>;

/**
 * 목록 조회
 */
export const getLoanKinds = async () => {
  try {
    const loanKinds = await prisma.loanKind.findMany();

    return {
      loanKinds,
    };
  } catch (error) {
    console.error(error);
    return { loanKinds: [] };
  }
};
