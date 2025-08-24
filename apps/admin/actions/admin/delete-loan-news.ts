"use server";

import { Prisma, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

export type DeleteLoanNews = Prisma.PromiseReturnType<typeof deleteLoanNews>;

export async function deleteLoanNews(id: number) {
  try {
    await prisma.loanNews.delete({
      where: { id },
    });

    revalidatePath(`/loan-news`);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
