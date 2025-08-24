"use server";

import { Prisma, prisma } from "@repo/db";

export type GetFinancialNewsList = Prisma.PromiseReturnType<
  typeof getFinancialNewsList
>;

type Props = {
  page: number;
  query: string;
};

/**
 * 목록 조회
 */
export const getFinancialNewsList = async ({ page, query }: Props) => {
  try {
    const where: Prisma.FinancialNewsWhereInput = {};

    if (query) {
      where.OR = [
        {
          title: {
            contains: query,
          },
        },
      ];
    }

    const [financialNewsList, meta] = await prisma.financialNews
      .paginate({
        where,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          link: true,
          createdAt: true,
        },
      })
      .withPages({
        page,
        limit: 12,
        includePageCount: true,
      });

    return {
      financialNewsList,
      meta,
    };
  } catch (error) {
    console.error(error);
    return { financialNewsList: [], meta: null };
  }
};
