"use server";

import { prisma, SponsorAd } from "@repo/db";

export async function updateSponsorAds(
  sponsorAds: Pick<
    SponsorAd,
    "id" | "lenderName" | "title1" | "title2" | "link"
  >[]
) {
  try {
    await prisma.$transaction(
      sponsorAds.map((ad) =>
        prisma.sponsorAd.update({
          where: { id: ad.id },
          data: {
            ...ad,
          },
        })
      )
    );
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: "저장 실패" };
  }
}
