"use server";

import { Prisma, prisma } from "@repo/db";

export type GetAdvertisingGuide = Prisma.PromiseReturnType<
  typeof getAdvertisingGuide
>;

/**
 *
 */
export const getAdvertisingGuide = async (id: number) => {
  try {
    const advertisingGuide = await prisma.advertisingGuide.findUnique({
      where: {
        id,
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

    return advertisingGuide;
  } catch (error) {
    console.error(error);
    return null;
  }
};
