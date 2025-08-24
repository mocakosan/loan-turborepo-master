"use server";

import { Prisma, prisma } from "@repo/db";

export type GetLoanNewsList = Prisma.PromiseReturnType<typeof getLoanNewsList>;

type Props = {
  page: number;
  query: string;
};

/**
 * 목록 조회
 */
export const getLoanNewsList = async ({ page, query }: Props) => {
  try {
    const where: Prisma.LoanNewsWhereInput = {};

    if (query) {
      where.OR = [
        {
          title: {
            contains: query,
          },
        },
      ];
    }

    const [loanNewsList, meta] = await prisma.loanNews
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
      loanNewsList,
      meta,
    };
  } catch (error) {
    console.error(error);
    return { loanNewsList: [], meta: null };
  }
};
