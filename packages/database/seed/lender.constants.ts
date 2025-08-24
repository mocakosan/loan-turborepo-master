import { Prisma } from "../generated/prisma";

export const fakerLender: Prisma.LenderUncheckedCreateInput[] = new Array(16)
  .fill(null)
  .map((_, index) => {
    return {
      backgroundImage: `bg_recommend_list${Math.floor(Math.random() * 6) + 1}.png`,
      regionKinds: {
        connect: {
          id: Math.floor(Math.random() * 16) + 1,
        },
      },
      loanKinds: {
        connect: {
          id: Math.floor(Math.random() * 26) + 1,
        },
      },
      title1: "오늘 필요하신 분!",
      title2: "누구나 가능합니다",
      lenderName: "ㅇㅇ대부",
      content: `지금 해결 도와드립니다<br />
24시 상담`,
      phoneNumber: `010-1234-1234`,
      isVisibleMain: true,
      isVisibleArea: true,
      isVisibleLoan: true,
      lenderInfo: {
        create: {
          title: "전국 무방문 당일대출 99프로",
          companyName: "태평양대부중개",
          registrationNumber: "서울특별-2025-0001",
          phoneNumber: `010-2222-${String(index).padStart(4, "0")}`,
          registrationAuthority: "등록기관명",
          registrationAuthorityPhoneNumber: `053-000-${String(index).padStart(4, "0")}`,
          office: "서울특별시 강남구 ㅇㅇ대로 500 4층",
          monthRate: "상담 후 결정",
          loanLimit: "상담 후 결정",
          additionalCost: "없음",
          repaymentMethod: "상담 후 결정",
          yearRate: "연 20%",
          overdueRate: "연 20% 이내",
          earlyRepaymentFee: "없음",
          repaymentPeriod: "상담 후 결정",
          description: `☎ 대출당일을 보고 연락드렸다고 하시면 보다 상담이
                    쉬워집니다.<br /><br />
                    24시 언제나 상담가능한 태평양 대부중개 입니다^^<br /><br />
                    승인률 99.99%<br />
                    당일송금 100%<br />
                    최저금리 1%~19%로<br /><br />
                    쉽고 빠르게 도와드리겠습니다 ^^<br /><br />
                    금융협회 정식 등록업체!<br />
                    업계 최다 상품보유로 상황에맞는 상품 매칭<br />
                    기대출이 많아 추가 한도가 나오지않는분들 최대 한도
                    도와드리겠습니다.<br /><br />
                    업계 최대 승인률 , 업계 최대 한도<br />
                    빠르고 친절한 상담 , 진행<br />
                    대출이후에도 신용관리를 위한 솔루션제시<br /><br /><br />
                    ＃ 직장인 / 프리랜서 / 자영업자 / 저신용자 / 개인회생 상담
                    가능<br />
                    ＃ 군인・군미필 / 아르바이트 / 계약직 상담 가능<br />
                    ＃ 주부 / 여성 / 유흥업 등등 상담 가능<br />
                    ＃ 무직 / 주부 / 무소득자 / 배달대행 등등 상담 가능<br /><br />
                    ※ 저희는 선입금 / 폰테크 등 내구제 / 불법사채
                    취급하지않습니다.<br /><br />
                    용기내어 연락주시면 친절하게 최선을 다해
                    도와드리겠습니다!!!<br /><br />
                    ☎365일 24시 언제나 편하게 상담 가능하며<br />
                    궁금하신 사항은 언제든 편하게 연락주시길 바랍니다.`,
        },
      },
    };
  });
