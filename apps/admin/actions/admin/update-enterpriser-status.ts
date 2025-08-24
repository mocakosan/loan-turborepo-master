"use server";

import { EnterpriserStatus, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

export async function updateEnterpriserStatus(
  no: number,
  data: {
    enterpriserStatus: EnterpriserStatus;
  }
) {
  try {
    await prisma.enterpriser.update({
      where: {
        no,
      },
      data: {
        enterpriserStatus: data.enterpriserStatus,
      },
    });

    revalidatePath("/enterpriser-status");

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
