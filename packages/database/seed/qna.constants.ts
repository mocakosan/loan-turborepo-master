import { Prisma } from "../generated/prisma";

export const fakerQnA: Prisma.QnACreateInput[] = new Array(10)
  .fill(null)
  .map((_) => {
    return {
      title: "급전 대출 문의 긴급 100만원 구합니다",
      content: `<p>
                      안녕하세요 추천대출 입니다^^<br /><br />
                      여러분의 질문에 성심 성의껏 답변 드리겠습니다.<br /><br />
                      많은 성원 부탁드립니다 ^^<br /><br />
                      감사합니다!
                    </p>`,
      reply: ` 안녕하세요 추천대출 입니다^^<br /><br />
                        여러분의 질문에 성심 성의껏 답변 드리겠습니다.<br /><br />
                        많은 성원 부탁드립니다 ^^<br /><br />
                        감사합니다!`,
    };
  });
