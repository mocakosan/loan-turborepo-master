"use server";

import { Prisma, prisma } from "@repo/db";
import { startOfDay } from "date-fns";

export type GetAllVisitor = Prisma.PromiseReturnType<typeof getAllVisitor>;

/**
 * 방문자 전체 조회
 */
export const getAllVisitor = async () => {
  try {
    const [todayCount, { totalCount, isAuto }, loanInquiryCount] =
      await Promise.all([
        prisma.visitor
          .findUnique({
            where: {
              date: startOfDay(new Date()),
            },
            select: {
              count: true,
            },
          })
          .then((value) => value?.count || 0),
        prisma.totalVisit
          .findFirst({
            select: {
              count: true,
              isAuto: true,
            },
          })
          .then((value) => ({
            totalCount: value?.count || 0,
            isAuto: value?.isAuto,
          })),
        prisma.loanInquiryCount
          .findFirst({
            select: {
              count: true,
            },
          })
          .then((value) => value?.count || 0),
      ]);

    return { todayCount, totalCount, isAuto, loanInquiryCount };
  } catch (error) {
    console.error(error);
    return { todayCount: 0, totalCount: 0, isAuto: false, loanInquiryCount: 0 };
  }
};
