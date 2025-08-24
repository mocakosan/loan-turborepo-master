"use server";

import { Lender, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

type Payload = Pick<Lender, "id">;

export async function deleteLender(item: Payload) {
  try {
    await prisma.lender.delete({
      where: { id: item.id },
    });

    revalidatePath("/lender-ad-management");

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
