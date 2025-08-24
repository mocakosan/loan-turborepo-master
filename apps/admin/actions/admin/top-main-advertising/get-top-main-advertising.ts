"use server";

import { Prisma, prisma } from "@repo/db";

export type GetTopMainAdvertising = Prisma.PromiseReturnType<
  typeof getTopMainAdvertising
>;

/**
 * 상위 메인광고 목록 조회
 */
export const getTopMainAdvertising = async () => {
  try {
    const topMainAdvertisings = await prisma.topMainAdvertising.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      topMainAdvertisings,
    };
  } catch (error) {
    console.error(error);
    return { topMainAdvertisings: [] };
  }
};
