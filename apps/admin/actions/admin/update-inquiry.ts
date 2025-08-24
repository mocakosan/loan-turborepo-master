"use server";

import { prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

export async function updateInquiry(
  id: number,
  data: { title: string; content: string }
) {
  try {
    await prisma.inquiry.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        content: data.content,
      },
    });

    revalidatePath("/inquiry");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: "저장 실패" };
  }
}
