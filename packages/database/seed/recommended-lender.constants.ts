import { Prisma } from "../generated/prisma";

export const fakerRecommendedLender: Prisma.RecommendedLenderCreateInput[] =
  new Array(16).fill(null).map((_, index) => {
    return {
      title1: "새출발 도와드립니다",
      title2: "월변으로 개인돈 대환대출",
      content: `출장비 NO~! 안심대출 YES<br />
100만원 월 1만 5천원<br />
당일대출 / 비밀보장`,
      lenderName: "24시대부",
      phoneNumber: `010-7777-${String(index).padStart(4, "0")}`,
      link: "",
      lender: {
        connect: {
          id: index + 1,
        },
      },
    };
  });
