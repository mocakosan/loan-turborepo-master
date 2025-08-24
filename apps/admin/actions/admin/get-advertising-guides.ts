"use server";

import { Prisma, prisma } from "@repo/db";

export type GetAdvertisingGuides = Prisma.PromiseReturnType<
  typeof getAdvertisingGuides
>;

/**
 * 목록 조회
 */
export const getAdvertisingGuides = async () => {
  try {
    const where: Prisma.AdvertisingGuideWhereInput = {};

    const advertisingGuides = await prisma.advertisingGuide.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        amount: true,
        standard: true,
        position: true,
        description: true,
      },
    });

    return {
      advertisingGuides,
    };
  } catch (error) {
    console.error(error);
    return { advertisingGuides: [] };
  }
};
