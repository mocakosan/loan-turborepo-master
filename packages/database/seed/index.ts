import { PrismaClient } from "../generated/prisma";
import { fakerRegionKind } from "./region.constants";
import { fakerLoanKind } from "./loan-kind.constants";
import { fakerRecommendedLender } from "./recommended-lender.constants";
import { fakerTopMainAdvertising } from "./top-main-advertising.constants";
import { fakerLender } from "./lender.constants";
import { fakerNotice } from "./notice.constants";
import { fakerFinancialNews } from "./financial-news.constants";
import { fakerLoanNews } from "./loan-news.constants";
import { fakerLoanInquiry } from "./loan-inquiry.constants";
import { fakerQnA } from "./qna.constants";
import { fakerAdvertisingGuide } from "./advertising-guide.constants";
import { fakerSponsorAd } from "./sponsor-ad.constants";
import { fakerLineAd } from "./line-ad.constants";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding...");

  const [
    adminCount,
    regionKindCount,
    loanKindCount,
    lenderCount,
    recommendedLenderCount,
    topMainAdvertisingCount,
    financialNewsCount,
    loanNewsCount,
    noticeCount,
    loanInquiryCount,
    qnACount,
    advertisingGuideCount,
    sponsorAdCount,
    totalVisitCount,
    loanInquiryCountCount,
    lineAdCount,
  ] = await Promise.all([
    prisma.admin.count({
      where: {
        email: "chucheon114",
      },
    }),
    prisma.regionKind.count(),
    prisma.loanKind.count(),
    prisma.lender.count(),
    prisma.recommendedLender.count(),
    prisma.topMainAdvertising.count(),
    prisma.financialNews.count(),
    prisma.loanNews.count(),
    prisma.notice.count(),
    prisma.loanInquiry.count(),
    prisma.qnA.count(),
    prisma.advertisingGuide.count(),
    prisma.sponsorAd.count(),
    prisma.totalVisit.count(),
    prisma.loanInquiryCount.count(),
    prisma.lineAd.count(),
  ]);

  if (adminCount === 0) {
    const email = process.env.ADMIN_EMAIL;
    const hashedPassword = await argon2.hash(process.env.ADMIN_PASSWORD);

    /// --------- Admin ---------------
    await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  }

  if (regionKindCount === 0) {
    /// --------- Region Kind ---------------
    for (let i = 0; i < fakerRegionKind.length; i++) {
      await prisma.regionKind.create({ data: fakerRegionKind[i] });
    }
  }

  if (loanKindCount === 0) {
    /// --------- Loan Kind ---------------
    for (let i = 0; i < fakerLoanKind.length; i++) {
      await prisma.loanKind.create({ data: fakerLoanKind[i] });
    }
  }

  if (lenderCount === 0) {
    /// --------- Lender ---------------
    for (let i = 0; i < fakerLender.length; i++) {
      await prisma.lender.create({
        data: fakerLender[i],
      });
    }
  }

  if (recommendedLenderCount === 0) {
    /// --------- Recommended Lender ---------------
    for (let i = 0; i < fakerRecommendedLender.length; i++) {
      await prisma.recommendedLender.create({
        data: fakerRecommendedLender[i],
      });
    }
  }

  if (topMainAdvertisingCount === 0) {
    /// --------- TopMainAdvertising ---------------
    for (let i = 0; i < fakerTopMainAdvertising.length; i++) {
      await prisma.topMainAdvertising.create({
        data: fakerTopMainAdvertising[i],
      });
    }
  }

  if (financialNewsCount === 0) {
    /// --------- Financial News ---------------
    for (let i = 0; i < fakerFinancialNews.length; i++) {
      await prisma.financialNews.create({
        data: fakerFinancialNews[i],
      });
    }
  }

  if (loanNewsCount === 0) {
    /// --------- Loan News ---------------
    for (let i = 0; i < fakerLoanNews.length; i++) {
      await prisma.loanNews.create({
        data: fakerLoanNews[i],
      });
    }
  }

  if (noticeCount === 0) {
    /// --------- Notice ---------------
    for (let i = 0; i < fakerNotice.length; i++) {
      await prisma.notice.create({
        data: fakerNotice[i],
      });
    }
  }

  if (loanInquiryCount === 0) {
    /// --------- Loan Inquiry ---------------
    for (let i = 0; i < fakerLoanInquiry.length; i++) {
      await prisma.loanInquiry.create({
        data: fakerLoanInquiry[i],
      });
    }
  }

  if (qnACount === 0) {
    /// --------- QnA ---------------
    for (let i = 0; i < fakerQnA.length; i++) {
      await prisma.qnA.create({
        data: fakerQnA[i],
      });
    }
  }

  if (advertisingGuideCount === 0) {
    /// --------- Advertising Guide ---------------
    for (let i = 0; i < fakerAdvertisingGuide.length; i++) {
      await prisma.advertisingGuide.create({
        data: fakerAdvertisingGuide[i],
      });
    }
  }

  if (sponsorAdCount === 0) {
    /// --------- Sponsor Ad ---------------
    for (let i = 0; i < fakerSponsorAd.length; i++) {
      await prisma.sponsorAd.create({
        data: fakerSponsorAd[i],
      });
    }
  }

  if (totalVisitCount === 0) {
    /// --------- TotalVisit ---------------
    const today = new Date();
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const visitorCount = Math.floor(Math.random() * 3001) + 1000;
    await prisma.visitor.upsert({
      where: {
        date,
      },
      update: {
        count: visitorCount,
      },
      create: {
        date,
        count: visitorCount,
      },
    });
    await prisma.totalVisit.create({
      data: {
        id: 1,
        count: visitorCount,
      },
    });
  }

  if (loanInquiryCountCount === 0) {
    /// --------- LoanInquiryCount ---------------
    await prisma.loanInquiryCount.create({
      data: {
        id: 1,
        count: Math.floor(Math.random() * 3001) + 1000,
      },
    });
  }

  if (lineAdCount === 0) {
    /// --------- Line Ad ---------------
    for (let i = 0; i < fakerLineAd.length; i++) {
      await prisma.lineAd.create({
        data: fakerLineAd[i],
      });
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
