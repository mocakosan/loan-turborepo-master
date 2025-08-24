"use server";

import { Prisma, prisma } from "@repo/db";

export type GetInquiries = Prisma.PromiseReturnType<typeof getInquiries>;

type Props = {
  page: number;
  query: string;
};

/**
 * 목록 조회
 */
export const getInquiries = async ({ page, query }: Props) => {
  try {
    const where: Prisma.InquiryWhereInput = {};

    if (query) {
      where.OR = [
        {
          title: {
            contains: query,
          },
        },
      ];
    }

    const [inquiries, meta] = await prisma.inquiry
      .paginate({
        where,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          inquiryKind: true,
          createdAt: true,
        },
      })
      .withPages({
        page,
        limit: 12,
        includePageCount: true,
      });

    return {
      inquiries,
      meta,
    };
  } catch (error) {
    console.error(error);
    return { inquiries: [], meta: null };
  }
};
