"use server";

import { prisma, RecommendedLender } from "@repo/db";
import { revalidatePath } from "next/cache";

type SavePayload = Pick<
  RecommendedLender,
  "id" | "title1" | "title2" | "content" | "lenderName" | "phoneNumber" | "link"
>;

export async function updateRecommendedLender(item: SavePayload) {
  try {
    await prisma.recommendedLender.update({
      where: { id: item.id },
      data: {
        title1: item.title1,
        title2: item.title2,
        content: item.content,
        lenderName: item.lenderName,
        phoneNumber: item.phoneNumber,
        link: item.link,
      },
    });

    revalidatePath("/lender-ad-management");

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
