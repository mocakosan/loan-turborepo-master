"use server";

import { Prisma, prisma } from "@repo/db";

export type GetEnterprisers = Prisma.PromiseReturnType<typeof getEnterprisers>;

type Props = {
  page: number;
  query: string;
};

/**
 * 사업자 목록 조회
 */
export const getEnterprisers = async ({ page, query }: Props) => {
  try {
    const where: Prisma.EnterpriserWhereInput = {};

    if (query) {
      where.OR = [
        {
          companyName: { contains: query },
        },
        {
          phoneNumber: { contains: query },
        },
        {
          name: { contains: query },
        },
      ];
    }

    const [enterprisers, meta] = await prisma.enterpriser
      .paginate({
        where,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          no: true,
          companyName: true,
          email: true,
          phoneNumber: true,
          enterpriserStatus: true,
        },
      })
      .withPages({
        page,
        limit: 12,
        includePageCount: true,
      });

    return { enterprisers, meta };
  } catch (error) {
    console.error(error);
    return { enterprisers: [], meta: null };
  }
};
