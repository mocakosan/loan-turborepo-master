"use server";

import { LineAd, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

export async function updateLineAds(
  lineAds: Pick<
    LineAd,
    "id" | "region" | "title1" | "title2" | "lenderName" | "link"
  >[]
) {
  try {
    await prisma.$transaction(
      lineAds.map((ad) =>
        prisma.lineAd.update({
          where: { id: ad.id },
          data: {
            ...ad,
          },
        })
      )
    );

    revalidatePath("/lender-ad-management");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: "저장 실패" };
  }
}
