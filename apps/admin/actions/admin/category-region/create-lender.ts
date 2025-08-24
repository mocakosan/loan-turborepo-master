"use server";

import { prisma } from "@repo/db";

export async function createLender(data: {
  formData: {
    title1: string;
    title2: string;
    lenderName: string;
    content: string;
    phoneNumber: string;
    backgroundImage: string;
  };
  lenderInfo: {
    title: string;
    companyName: string;
    registrationNumber: string;
    phoneNumber: string;
    registrationAuthority: string;
    registrationAuthorityPhoneNumber: string;
    office: string;
    monthRate: string;
    loanLimit: string;
    additionalCost: string;
    repaymentMethod: string;
    yearRate: string;
    overdueRate: string;
    earlyRepaymentFee: string;
    repaymentPeriod: string;
    description: string;
  };
  regionKindIds: number[];
  loanKindIds: number[];
}) {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.lender.create({
        data: {
          title1: data.formData.title1,
          title2: data.formData.title2,
          lenderName: data.formData.lenderName,
          content: data.formData.content,
          phoneNumber: data.formData.phoneNumber,
          backgroundImage: data.formData.backgroundImage,
          lenderInfo: {
            create: {
              title: data.lenderInfo.title,
              companyName: data.lenderInfo.companyName,
              registrationNumber: data.lenderInfo.registrationNumber,
              phoneNumber: data.lenderInfo.phoneNumber,
              registrationAuthority: data.lenderInfo.registrationAuthority,
              registrationAuthorityPhoneNumber:
                data.lenderInfo.registrationAuthorityPhoneNumber,
              office: data.lenderInfo.office,
              monthRate: data.lenderInfo.monthRate,
              loanLimit: data.lenderInfo.loanLimit,
              additionalCost: data.lenderInfo.additionalCost,
              repaymentMethod: data.lenderInfo.repaymentMethod,
              yearRate: data.lenderInfo.yearRate,
              overdueRate: data.lenderInfo.overdueRate,
              earlyRepaymentFee: data.lenderInfo.earlyRepaymentFee,
              repaymentPeriod: data.lenderInfo.repaymentPeriod,
              description: data.lenderInfo.description,
            },
          },
          regionKinds: {
            connect: data.regionKindIds.map((id) => ({
              id,
            })),
          },
          loanKinds: {
            connect: data.loanKindIds.map((id) => ({
              id,
            })),
          },
        },
      });
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: "저장 실패" };
  }
}
