import { Controller, Get, Render, Res } from '@nestjs/common';
import { Response } from 'express';
import { format, formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Render('index')
  async index() {
    const [
      recommendedLenders,
      topMainAdvertisings,
      regionKinds,
      loanKinds,
      loanInquiries,
      financialNews,
      loanNews,
      notices,
      lenders,
      lineAds,
    ] = await Promise.all([
      this.prisma.recommendedLender.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          title1: true,
          title2: true,
          content: true,
          lenderName: true,
          phoneNumber: true,
          link: true,
        },
      }),
      this.prisma.topMainAdvertising.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          lenderName: true,
          title1: true,
          title2: true,
          content: true,
          phoneNumber: true,
          link: true,
        },
      }),
      this.prisma.regionKind.findMany({
        select: {
          id: true,
          name: true,
        },
      }),
      this.prisma.loanKind.findMany({
        select: {
          id: true,
          name: true,
        },
      }),
      this.prisma.loanInquiry.findMany({
        take: 15,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          title: true,
          regionKind: {
            select: {
              name: true,
            },
          },
          createdAt: true,
          amount: true,
        },
      }),
      this.prisma.financialNews.findMany({
        take: 6,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          title: true,
          link: true,
          createdAt: true,
        },
      }),
      this.prisma.loanNews.findMany({
        take: 6,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          title: true,
          link: true,
          createdAt: true,
        },
      }),
      this.prisma.notice.findMany({
        take: 6,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
        },
      }),
      this.prisma.$queryRaw`
        SELECT 
          a.id, 
          a.title1, 
          a.title2, 
          a.lender_name as "lenderName",
          a.content, 
          a.phone_number as "phoneNumber",
          a.created_at as "createdAt",
          a.background_image as "backgroundImage"
        FROM lenders AS a
        WHERE a.is_visible_main = true
        ORDER BY RANDOM();
      `,
      this.prisma.$queryRaw`
        SELECT 
          a.id, 
          a.region,
          a.title1, 
          a.title2, 
          a.lender_name as "lenderName",
          a.link,
          a.created_at as "createdAt"
        FROM line_ads AS a
        ORDER BY RANDOM()
        LIMIT 10;
      `,
    ]);

    return {
      recommendedLenders,
      topMainAdvertisings,
      sidoList: regionKinds,
      loanList: loanKinds,
      lenders: (lenders as any).map((item) => ({
        ...item,
        createdAt: format(item.createdAt, 'yyyy-MM-dd'),
        distanceToNow: formatDistanceToNow(item.createdAt, {
          addSuffix: true,
          locale: ko,
        }),
      })),
      lineAds: (lineAds as any).map((item) => ({
        ...item,
        createdAt: format(item.createdAt, 'yyyy-MM-dd'),
        distanceToNow: formatDistanceToNow(item.createdAt, {
          addSuffix: true,
          locale: ko,
        }),
      })),
      loanInquiries: loanInquiries.map((item) => ({
        ...item,
        amount: new Intl.NumberFormat('ko-KR').format(Number(item.amount)),
        createdAt: format(item.createdAt, 'yyyy-MM-dd'),
        distanceToNow: formatDistanceToNow(item.createdAt, {
          addSuffix: true,
          locale: ko,
        }),
      })),
      financialNews: financialNews.map((item) => ({
        ...item,
        createdAt: format(item.createdAt, 'yyyy.MM.dd'),
      })),
      loanNews: loanNews.map((item) => ({
        ...item,
        createdAt: format(item.createdAt, 'yyyy.MM.dd'),
      })),
      notices: notices.map((item) => ({
        ...item,
        createdAt: format(item.createdAt, 'yyyy.MM.dd'),
      })),
    };
  }

  // 헬스체크 엔드포인트 - JSON 응답으로 별도 처리
  @Get('health')
  healthCheck(@Res() res: Response) {
    return res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      service: 'loan-api',
    });
  }
}