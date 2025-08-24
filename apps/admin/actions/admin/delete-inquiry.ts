"use server";

import { Prisma, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

export type DeleteInquiry = Prisma.PromiseReturnType<typeof deleteInquiry>;

export async function deleteInquiry(id: number) {
  try {
    await prisma.inquiry.delete({
      where: { id },
    });

    revalidatePath(`/inquiry`);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
