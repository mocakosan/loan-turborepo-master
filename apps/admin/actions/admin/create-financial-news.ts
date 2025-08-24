"use server";

import { Prisma, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

export type CreateFinancialNews = Prisma.PromiseReturnType<
  typeof createFinancialNews
>;

type Props = {
  title: string;
  link: string;
};

export async function createFinancialNews({ title, link }: Props) {
  try {
    await prisma.financialNews.create({
      data: {
        title,
        link,
      },
    });

    revalidatePath(`/financial-news`);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
