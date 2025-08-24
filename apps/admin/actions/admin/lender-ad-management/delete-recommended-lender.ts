"use server";

import { prisma, RecommendedLender } from "@repo/db";
import { revalidatePath } from "next/cache";

type Payload = Pick<RecommendedLender, "id">;

export async function deleteRecommendedLender(item: Payload) {
  try {
    await prisma.recommendedLender.delete({
      where: { id: item.id },
    });

    revalidatePath("/lender-ad-management");

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
