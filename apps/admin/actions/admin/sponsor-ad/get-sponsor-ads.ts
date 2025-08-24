"use server";

import { Prisma, prisma } from "@repo/db";

export type GetSponsorAds = Prisma.PromiseReturnType<typeof getSponsorAds>;

/**
 * 목록 조회
 */
export const getSponsorAds = async () => {
  try {
    const sponsorAds = await prisma.sponsorAd.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        lenderName: true,
        title1: true,
        title2: true,
        link: true,
      },
    });

    return {
      sponsorAds,
    };
  } catch (error) {
    console.error(error);
    return { sponsorAds: [] };
  }
};
