"use server";

import { AdvertisingInquiryStatus, Prisma, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

export async function updateAdvertisingInquiry(
  id: number,
  data: { newStatus?: AdvertisingInquiryStatus }
) {
  try {
    const updateInput: Prisma.AdvertisingInquiryUpdateInput = {};

    if (data?.newStatus) {
      updateInput.status = data.newStatus;
    }

    await prisma.advertisingInquiry.update({
      where: {
        id,
      },
      data: updateInput,
    });

    revalidatePath("/advertising-inquiry");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: "저장 실패" };
  }
}
