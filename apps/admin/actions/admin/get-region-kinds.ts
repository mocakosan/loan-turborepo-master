"use server";

import { Prisma, prisma } from "@repo/db";

export type GetRegionKinds = Prisma.PromiseReturnType<typeof getRegionKinds>;

/**
 * 목록 조회
 */
export const getRegionKinds = async () => {
  try {
    const regionKinds = await prisma.regionKind.findMany();

    return {
      regionKinds,
    };
  } catch (error) {
    console.error(error);
    return { regionKinds: [] };
  }
};
