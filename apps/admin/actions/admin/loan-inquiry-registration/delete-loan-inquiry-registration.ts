"use server";

import { Prisma, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

export type DeleteLoanInquiryRegistration = Prisma.PromiseReturnType<
  typeof deleteLoanInquiryRegistration
>;

type Props = {
  id: number;
};

/**
 * 대출문의 등록 삭제
 */
export const deleteLoanInquiryRegistration = async ({ id }: Props) => {
  try {
    await prisma.loanInquiryRegistration.delete({
      where: {
        id,
      },
    });

    revalidatePath("/company-registration");

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
