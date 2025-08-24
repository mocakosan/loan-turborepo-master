"use server";

import { Prisma, prisma } from "@repo/db";

export type GetNotices = Prisma.PromiseReturnType<typeof getNotices>;

type Props = {
  page: number;
  query: string;
};

/**
 * 목록 조회
 */
export const getNotices = async ({ page, query }: Props) => {
  try {
    const where: Prisma.NoticeWhereInput = {};

    if (query) {
      where.OR = [
        {
          title: {
            contains: query,
          },
        },
      ];
    }

    const [notices, meta] = await prisma.notice
      .paginate({
        where,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
        },
      })
      .withPages({
        page,
        limit: 12,
        includePageCount: true,
      });

    return {
      notices,
      meta,
    };
  } catch (error) {
    console.error(error);
    return { notices: [], meta: null };
  }
};
