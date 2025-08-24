"use server";

import { Prisma, prisma } from "@repo/db";

export type GetAllEnterpriser = Prisma.PromiseReturnType<
  typeof getAllEnterpriser
>;

/**
 * 사업자 전체 조회
 */
export const getAllEnterpriser = async () => {
  try {
    const where: Prisma.EnterpriserWhereInput = {
      enterpriserStatus: "APPROVE",
    };

    const enterprisers = await prisma.enterpriser.findMany({
      where,
      select: {
        id: true,
        companyName: true,
        loanInquiryRegistrations: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            count: true,
            startedAt: true,
            endedAt: true,
            createdAt: true,
            _count: {
              select: {
                loanInquiries: true,
              },
            },
          },
        },
      },
    });

    return { enterprisers };
  } catch (error) {
    console.error(error);
    return { enterprisers: [] };
  }
};
