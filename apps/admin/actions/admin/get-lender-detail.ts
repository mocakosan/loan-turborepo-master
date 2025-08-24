"use server";

import { Prisma, prisma } from "@repo/db";

export type GetLenderDetail = Prisma.PromiseReturnType<typeof getLenderDetail>;

export async function getLenderDetail(id: number) {
  try {
    const lender = await prisma.lender.findUnique({
      where: { id },
      select: {
        title1: true,
        title2: true,
        lenderName: true,
        content: true,
        phoneNumber: true,
        isVisibleMain: true,
        isVisibleArea: true,
        isVisibleLoan: true,
        backgroundImage: true,
        lenderInfo: {
          select: {
            title: true,
            companyName: true,
            registrationNumber: true,
            phoneNumber: true,
            registrationAuthority: true,
            registrationAuthorityPhoneNumber: true,
            office: true,
            monthRate: true,
            loanLimit: true,
            additionalCost: true,
            repaymentMethod: true,
            yearRate: true,
            overdueRate: true,
            earlyRepaymentFee: true,
            repaymentPeriod: true,
            description: true,
          },
        },
        regionKinds: {
          select: {
            id: true,
          },
        },
        loanKinds: {
          select: {
            id: true,
          },
        },
      },
    });

    return lender;
  } catch (error) {
    console.error(error);
    return null;
  }
}
