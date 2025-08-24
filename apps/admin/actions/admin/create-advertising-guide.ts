"use server";

import { prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

export async function createAdvertisingGuide(data: {
  title: string;
  amount: number;
  standard: string;
  position: string;
  description: string;
}) {
  try {
    await prisma.advertisingGuide.create({
      data: {
        title: data.title,
        amount: data.amount,
        standard: data.standard,
        position: data.position,
        description: data.description,
      },
    });

    revalidatePath("/advertising-guide");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: "저장 실패" };
  }
}
