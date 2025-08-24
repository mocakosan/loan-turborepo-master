"use server";

import { prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

export async function createNotice(data: { title: string; content: string }) {
  try {
    await prisma.notice.create({
      data: {
        title: data.title,
        content: data.content,
      },
    });

    revalidatePath("/notice");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: "저장 실패" };
  }
}
