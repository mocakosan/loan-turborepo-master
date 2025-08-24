"use server";

import { Prisma, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

export type CreateLoanInquiryRegistration = Prisma.PromiseReturnType<
  typeof createLoanInquiryRegistration
>;

type Props = {
  count: number;
  startedAt: Date;
  endedAt: Date;
  enterpriserId: string;
};

/**
 * 대출문의 등록 생성
 */
export const createLoanInquiryRegistration = async ({
  count,
  startedAt,
  endedAt,
  enterpriserId,
}: Props) => {
  try {
    await prisma.loanInquiryRegistration.create({
      data: {
        count,
        startedAt,
        endedAt,
        enterpriser: {
          connect: {
            id: enterpriserId,
          },
        },
      },
    });

    revalidatePath("/company-registration");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: "저장 실패" };
  }
};
