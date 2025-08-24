"use server";

import { Prisma, prisma } from "@repo/db";

export type GetLoanInquiries = Prisma.PromiseReturnType<
  typeof getLoanInquiries
>;

type Props = {
  page: number;
  query: string;
};

/**
 * 목록 조회
 */
export const getLoanInquiries = async ({ page, query }: Props) => {
  try {
    const where: Prisma.LoanInquiryWhereInput = {};

    if (query) {
      where.OR = [
        {
          regionKind: {
            name: {
              contains: query,
            },
          },
        },
        {
          title: {
            contains: query,
          },
        },
        {
          name: {
            contains: query,
          },
        },
      ];
    }

    const [loanInquiries, meta] = await prisma.loanInquiry
      .paginate({
        where,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          regionKind: {
            select: {
              name: true,
            },
          },
          title: true,
          name: true,
          createdAt: true,
        },
      })
      .withPages({
        page,
        limit: 12,
        includePageCount: true,
      });

    return {
      loanInquiries,
      meta,
    };
  } catch (error) {
    console.error(error);
    return { loanInquiries: [] };
  }
};
