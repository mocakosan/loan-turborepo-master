"use server";

import { Prisma, prisma } from "@repo/db";

export type GetRecommendedLenders = Prisma.PromiseReturnType<
  typeof getRecommendedLenders
>;

/**
 * 추천 대부업체 목록 조회
 */
export const getRecommendedLenders = async () => {
  try {
    const recommendedLenders = await prisma.recommendedLender.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      recommendedLenders,
    };
  } catch (error) {
    console.error(error);
    return { recommendedLenders: [] };
  }
};
