"use server";

import { Prisma, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

export type DeleteFinancialNews = Prisma.PromiseReturnType<
  typeof deleteFinancialNews
>;

export async function deleteFinancialNews(id: number) {
  try {
    await prisma.financialNews.delete({
      where: { id },
    });

    revalidatePath(`/financial-news`);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
