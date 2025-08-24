"use server";

import { prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

export async function deleteEnterpriser(no: number) {
  try {
    await prisma.enterpriser.delete({
      where: {
        no,
      },
    });

    revalidatePath("/enterpriser");

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
