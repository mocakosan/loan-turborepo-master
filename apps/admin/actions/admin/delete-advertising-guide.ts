"use server";

import { prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

export async function deleteAdvertisingGuide(id: number) {
  try {
    await prisma.advertisingGuide.delete({
      where: {
        id,
      },
    });

    revalidatePath("/advertising-guide");

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
