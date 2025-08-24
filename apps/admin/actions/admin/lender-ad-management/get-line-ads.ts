"use server";

import { Prisma, prisma } from "@repo/db";
import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export type GetLineAds = Prisma.PromiseReturnType<typeof getLineAds>;

/**
 * 목록 조회
 */
export const getLineAds = async () => {
  try {
    const lineAds = await prisma.lineAd.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        region: true,
        title1: true,
        title2: true,
        lenderName: true,
        link: true,
        createdAt: true,
      },
    });

    return {
      lineAds: lineAds.map((item) => ({
        ...item,
        createdAt: format(item.createdAt, "yyyy-MM-dd"),
        distanceToNow: formatDistanceToNow(item.createdAt, {
          addSuffix: true,
          locale: ko,
        }),
      })),
    };
  } catch (error) {
    console.error(error);
    return { lineAds: [] };
  }
};
