import { Prisma } from "../generated/prisma";

export const fakerSponsorAd: Prisma.SponsorAdCreateInput[] = new Array(5)
  .fill(null)
  .map((_) => {
    return {
      lenderName: "ㅇㅇ대부",
      title1: "오늘 필요하신 분!",
      title2: "누구나 가능합니다",
      link: "http://1.234.44.13/enterprise/enterprise_details/269",
    };
  });
