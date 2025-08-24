import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VisitorMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const ip =
      req.headers['x-forwarded-for']?.toString().split(',')[0] ||
      req.socket.remoteAddress ||
      '';
    const userAgent = req.headers['user-agent'];

    console.log('방문자:', ip, userAgent);

    await this.recordVisit(ip, userAgent);

    const [todayVisitCount, totalVisitCount, totalLoanInquiryCount] =
      await Promise.all([
        this.getTodayVisitCount(),
        this.getTotalVisitCount(),
        this.getTotalLoanInquiryCount(),
      ]);

    res.locals.todayVisitCount = new Intl.NumberFormat('ko-KR').format(
      Number(todayVisitCount),
    );
    res.locals.totalVisitCount = new Intl.NumberFormat('ko-KR').format(
      Number(totalVisitCount),
    );
    res.locals.totalLoanInquiryCount = new Intl.NumberFormat('ko-KR').format(
      Number(totalLoanInquiryCount),
    );

    next();
  }

  private isBot(userAgent: string | undefined): boolean {
    if (!userAgent) return true;

    const botPatterns = [
      /bot/i,
      /spider/i,
      /crawl/i,
      /slurp/i,
      /bing/i,
      /mediapartners/i,
      /Google-InspectionTool/i,
    ];

    return botPatterns.some((pattern) => pattern.test(userAgent));
  }

  async recordVisit(ip: string, userAgent?: string) {
    // 1. 봇 필터링
    if (this.isBot(userAgent)) return;

    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    // 2. 이미 방문한 IP면 카운트 안 함
    const alreadyVisited = await this.prisma.ipLog.findUnique({
      where: {
        ip_date: {
          ip,
          date: startOfDay,
        },
      },
    });

    if (alreadyVisited) return;

    await Promise.all([
      this.prisma.visitor.upsert({
        where: { date: startOfDay },
        update: { count: { increment: 1 } },
        create: { date: startOfDay, count: 1 },
      }),
      this.prisma.totalVisit.upsert({
        where: { id: 1 },
        update: { count: { increment: 1 } },
        create: { id: 1, count: 1 },
      }),
      this.prisma.ipLog.upsert({
        where: {
          ip_date: {
            ip,
            date: startOfDay,
          },
        },
        update: {},
        create: {
          ip,
          date: startOfDay,
        },
      }),
    ]);
  }

  async getTodayVisitCount(): Promise<number> {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    const visitor = await this.prisma.visitor.findUnique({
      where: { date: startOfDay },
    });

    return visitor?.count ?? 0;
  }

  async getTotalVisitCount(): Promise<number> {
    const total = await this.prisma.totalVisit.findFirst();

    return total?.count ?? 0;
  }

  async getTotalLoanInquiryCount(): Promise<number> {
    const loanInquiryCount = await this.prisma.loanInquiryCount.findFirst();

    return loanInquiryCount?.count ?? 0;
  }
}
