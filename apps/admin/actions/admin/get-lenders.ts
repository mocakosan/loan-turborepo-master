"use server";

import { Prisma, prisma } from "@repo/db";
import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export type GetLenders = Prisma.PromiseReturnType<typeof getLenders>;

type Props = {
  where?: Prisma.LenderWhereInput;
  regionKindId?: number;
  loanKindId?: number;
};

/**
 * 목록 조회
 */
export const getLenders = async ({
  where: whereClause,
  regionKindId,
  loanKindId,
}: Props) => {
  try {
    const where: Prisma.LenderWhereInput = {
      ...whereClause,
    };

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
      select: {
        id: true,
        title1: true,
        title2: true,
        lenderName: true,
        regionKinds: {
          select: {
            name: true,
          },
        },
        createdAt: true,
      },
    });

    return {
      lenders: lenders.map((item) => ({
        ...item,
        createdAt: format(item.createdAt, "yyyy-MM-dd"),
        distanceToNow: formatDistanceToNow(item.createdAt, {
          addSuffix: true,
          locale: ko,
        }),
      })),
    };
  } catch (error) {
    console.error(error);
    return { lenders: [] };
  }
};
