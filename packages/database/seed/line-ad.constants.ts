import { Prisma } from "../generated/prisma";

export const fakerLineAd: Prisma.LineAdCreateInput[] = new Array(10)
  .fill(null)
  .map((_) => {
    return {
      region: "서울",
      title1: "급전 마련은 여기서!",
      title2: "연체자 무직자 OK",
      lenderName: "24시희망대부",
      link: "http://1.234.44.13/enterprise/enterprise_details/269",
    };
  });
