"use server";

import { Prisma, prisma } from "@repo/db";

export type GetEnterpriser = Prisma.PromiseReturnType<typeof getEnterpriser>;

export async function getEnterpriser(no: number) {
  try {
    const enterpriser = await prisma.enterpriser.findUnique({
      where: { no },
      select: {
        name: true,
        phoneNumber: true,
        companyName: true,
        registrationStartDate: true,
        registrationEndDate: true,
        zip: true,
        address: true,
        addressDetail: true,

        loanLicense: true,
        businessLicense: true,

        identity: true,
        password: true,
        registrationNumber: true,
        advertisingPhoneNumber: true,
        registrationAuthority: true,
        registrationAuthorityPhoneNumber: true,
      },
    });

    return enterpriser;
  } catch (error) {
    console.error(error);
    return null;
  }
}
