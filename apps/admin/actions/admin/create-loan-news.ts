"use server";

import { Prisma, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

export type CreateLoanNews = Prisma.PromiseReturnType<typeof createLoanNews>;

type Props = {
  title: string;
  link: string;
};

export async function createLoanNews({ title, link }: Props) {
  try {
    await prisma.loanNews.create({
      data: {
        title,
        link,
      },
    });

    revalidatePath(`/loan-news`);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
