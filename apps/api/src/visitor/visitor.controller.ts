import { Controller } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller()
export class VisitorController {
  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 0 * * *') // 매일 자정
  async generateDailyVisitCount() {
    const totalVisit = await this.prisma.totalVisit.findFirst();
    if (!totalVisit?.isAuto) {
      return;
    }

    const today = new Date();
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    // 1000~4000 사이 랜덤
    const visitorCount = Math.floor(Math.random() * 3001) + 1000;

    // FIXME: 실시간 대출문의 수는 변경안되게 수정 요청으로 주석처리
    // const loanInquiryCount = Math.floor(Math.random() * 3001) + 1000;

    await Promise.all([
      this.prisma.visitor.upsert({
        where: { date },
        update: { count: visitorCount },
        create: { date, count: visitorCount },
      }),
      this.prisma.totalVisit.update({
        where: {
          id: 1,
        },
        data: {
          count: { increment: visitorCount },
        },
      }),
      // FIXME: 실시간 대출문의 수는 변경안되게 수정 요청으로 주석처리
      // this.prisma.loanInquiryCount.update({
      //   where: {
      //     id: 1,
      //   },
      //   data: {
      //     count: loanInquiryCount,
      //   },
      // }),
    ]);

    console.info(`방문자 수(${visitorCount})가 저장되었습니다.`);
    // FIXME: 실시간 대출문의 수는 변경안되게 수정 요청으로 주석처리
    // console.info(`실시간 대출문의 수(${loanInquiryCount})가 저장되었습니다.`);
  }
}
