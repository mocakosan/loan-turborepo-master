import { Prisma } from "../generated/prisma";

export const fakerFinancialNews: Prisma.FinancialNewsCreateInput[] = new Array(
  6
)
  .fill(null)
  .map((_) => {
    return {
      title: `유심 해킹 후폭풍...”비대면 금융 위축 우려” 유심 해킹
후폭풍...”비대면 금융 위축 우려” 유심 해킹
후폭풍...”비대면 금융 위축 우려”`,
      link: "https://www.wowtv.co.kr/NewsCenter/News/Read?articleId=202505155211c",
      hits: 0,
    };
  });
