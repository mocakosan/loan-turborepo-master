"use server";

import { prisma, TopMainAdvertising } from "@repo/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const AdSchema = z.object({
  id: z.number(),
  lenderName: z.string(),
  title1: z.string(),
  title2: z.string(),
  content: z.string(),
  phoneNumber: z.string(),
  link: z.string(),
});

export async function updateTopMainAdvertising(
  ad: Pick<
    TopMainAdvertising,
    | "id"
    | "lenderName"
    | "title1"
    | "title2"
    | "content"
    | "phoneNumber"
    | "link"
  >
) {
  try {
    const parsed = AdSchema.safeParse(ad);

    if (!parsed.success) {
      throw new Error("값이 올바르지 않습니다.");
    }

    await prisma.topMainAdvertising.update({
      where: { id: ad.id },
      data: {
        lenderName: ad.lenderName,
        title1: ad.title1,
        title2: ad.title2,
        content: ad.content,
        phoneNumber: ad.phoneNumber,
        link: ad.link,
      },
    });

    revalidatePath("/top-main-advertising");

    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: error?.message || "Unexpected error" };
  }
}
