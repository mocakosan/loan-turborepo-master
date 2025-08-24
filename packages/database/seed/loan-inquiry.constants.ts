import { Prisma } from "../generated/prisma";

export const fakerLoanInquiry: Prisma.LoanInquiryCreateInput[] = new Array(10)
  .fill(null)
  .map((_, index) => {
    return {
      title: `(${index + 1})급전 대출 문의 긴급 100만원 구합니다`,
      name: "태평양",
      isJob: false,
      age: "40",
      gender: "남자",
      amount: "300",
      isAfterConsult: false,
      phoneNumber: "010-1234-5555",
      content: `갑자기 건강상이유로 터사하고 이직준비중이지만 갑자기 찾아온 장애로 마땅히 살기가 힘드네요.\n
      사회초년생에 알지못하는사람에게 사기당하고 혼자 갚으려다가 빚이생겨 기초생활수급자로 10년동안 신용회복위원회 지원을 받아 성실히 값지만 수급비 받아 휴대폰 요금 신용회복위원회 납입금 각종공과금. 식비로. 히면 완전 생활비가없어서 생활고 입니다. 이러다간 진짜 고독사 할것같아서 대출을받고싶습니다. 신용회복위원회 공공정보기록삭제된지 오래되엇습니다 현재 올크 657점 나이스 690점 어디에서도 대출부결. 진심으로 살고싶습니다 진.짜 살고싶습니다 도와주세요`,
      isAgreeMarketing: false,
      hits: 0,
      regionKind: {
        connect: {
          id: Math.floor(Math.random() * 16) + 1,
        },
      },
    };
  });
