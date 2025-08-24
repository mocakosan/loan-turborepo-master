"use server";

import { prisma } from "@repo/db";
import { startOfDay } from "date-fns";
import { revalidatePath } from "next/cache";

type Props = {
  todayCount: number;
  totalCount: number;
  loanInquiryCount: number;
  isAuto: boolean;
};

export async function updateAllVisitor({
  todayCount,
  totalCount,
  loanInquiryCount,
  isAuto,
}: Props) {
  try {
    const today = startOfDay(new Date());

    await Promise.all([
      prisma.visitor.upsert({
        where: {
          date: today,
        },
        update: {
          count: todayCount,
        },
        create: {
          date: today,
          count: todayCount,
        },
      }),
      prisma.totalVisit.update({
        where: {
          id: 1,
        },
        data: {
          count: totalCount,
          isAuto,
        },
      }),
      prisma.loanInquiryCount.update({
        where: {
          id: 1,
        },
        data: {
          count: loanInquiryCount,
        },
      }),
    ]);

    revalidatePath("/visitor");

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
