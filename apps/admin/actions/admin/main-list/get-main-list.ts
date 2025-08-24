"use server";

import { Prisma, prisma } from "@repo/db";

export type GetMainList = Prisma.PromiseReturnType<typeof getMainList>;

type Props = {
  searchTerm?: string;
  regionKindId?: number;
  loanKindId?: number;
};

/**
 * 목록 조회
 */
export const getMainList = async (
  { searchTerm, regionKindId, loanKindId }: Props = {} as Props
) => {
  try {
    const where: Prisma.LenderWhereInput = {};

    if (searchTerm) {
      where.OR = [
        {
          title1: { contains: searchTerm },
        },
        {
          title2: { contains: searchTerm },
        },
        {
          content: { contains: searchTerm },
        },
        {
          lenderName: { contains: searchTerm },
        },
        {
          phoneNumber: { contains: searchTerm },
        },
      ];
    }

    if (regionKindId) {
      where.regionKinds = {
        some: {
          id: regionKindId,
        },
      };
    }

    if (loanKindId) {
      where.loanKinds = {
        some: {
          id: loanKindId,
        },
      };
    }

    const lenders = await prisma.lender.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      lenders,
    };
  } catch (error) {
    console.error(error);
    return { lenders: [] };
  }
};
