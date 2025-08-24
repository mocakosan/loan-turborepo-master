"use server";

import { Lender, prisma } from "@repo/db";

export async function updateMainList(
  lenders: Pick<
    Lender,
    "id" | "isVisibleMain" | "isVisibleArea" | "isVisibleLoan"
  >[]
) {
  try {
    await prisma.$transaction(
      lenders.map((lender) =>
        prisma.lender.update({
          where: { id: lender.id },
          data: {
            isVisibleMain: lender.isVisibleMain,
            isVisibleArea: lender.isVisibleArea,
            isVisibleLoan: lender.isVisibleLoan,
          },
        })
      )
    );
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: "저장 실패" };
  }
}
