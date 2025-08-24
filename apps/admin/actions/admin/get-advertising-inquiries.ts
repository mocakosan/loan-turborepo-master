"use server";

import { Prisma, prisma } from "@repo/db";

export type GetAdvertisingInquiries = Prisma.PromiseReturnType<
  typeof getAdvertisingInquiries
>;

type Props = {
  page: number;
};

/**
 * 목록 조회
 */
export const getAdvertisingInquiries = async ({ page }: Props) => {
  try {
    const where: Prisma.AdvertisingInquiryWhereInput = {};

    const [advertisingInquiries, meta] = await prisma.advertisingInquiry
      .paginate({
        where,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          advertisingInquiryKind: true,
          createdAt: true,
          enterpriser: {
            select: {
              companyName: true,
              phoneNumber: true,
            },
          },
          status: true,
        },
      })
      .withPages({
        page,
        limit: 12,
        includePageCount: true,
      });

    return {
      advertisingInquiries,
      meta,
    };
  } catch (error) {
    console.error(error);
    return { advertisingInquiries: [], meta: null };
  }
};
