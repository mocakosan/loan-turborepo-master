"use server";

import { prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

export async function updateEnterpriser(
  no: number,
  data: {
    name: string;
    phoneNumber: string;
    companyName: string;
    registrationStartDate: string;
    registrationEndDate: string;
    registrationNumber: string;
    advertisingPhoneNumber: string;
    registrationAuthority: string;
    registrationAuthorityPhoneNumber: string;
  },
  loanLicense: string,
  businessLicense: string
) {
  try {
    await prisma.enterpriser.update({
      where: {
        no,
      },
      data: {
        ...data,
        loanLicense,
        businessLicense,
      },
    });

    revalidatePath("/enterpriser");

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
