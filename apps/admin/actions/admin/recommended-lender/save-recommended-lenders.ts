"use server";

import { prisma, RecommendedLender } from "@repo/db";

type SavePayload = {
  items: Pick<
    RecommendedLender,
    "id" | "title1" | "title2" | "content" | "lenderName" | "phoneNumber"
  >[];
  deletedIds: number[];
};

export async function saveRecommendedLenders(payload: SavePayload) {
  const { items, deletedIds } = payload;

  // 생성할 데이터
  const createItems = items.filter((item) => item.id < 0);
  // 수정할 데이터
  const updateItems = items.filter((item) => item.id > 0);
  console.log({ createItems, updateItems, deletedIds });

  // 트랜잭션 처리
  const queries = [
    ...createItems.map((item) =>
      prisma.recommendedLender.create({
        data: {
          title1: item.title1,
          title2: item.title2,
          content: item.content,
          lenderName: item.lenderName,
          phoneNumber: item.phoneNumber,
          link: "",
        },
      })
    ),
    ...updateItems.map((item) =>
      prisma.recommendedLender.update({
        where: { id: item.id },
        data: {
          title1: item.title1,
          title2: item.title2,
          content: item.content,
          lenderName: item.lenderName,
          phoneNumber: item.phoneNumber,
        },
      })
    ),
    ...deletedIds.map((id) =>
      prisma.recommendedLender.delete({
        where: { id },
      })
    ),
  ];

  await prisma.$transaction(queries).catch((error) => {
    console.error(error);
  });
}
