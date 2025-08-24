"use server";

import { Prisma, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

export type DeleteLoanInquiry = Prisma.PromiseReturnType<
  typeof deleteLoanInquiry
>;

export async function deleteLoanInquiry(id: number) {
  try {
    await prisma.loanInquiry.delete({
      where: { id },
    });

    revalidatePath(`/loan-inquiry`);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
