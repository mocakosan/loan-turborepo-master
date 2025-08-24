import { Controller, Get, Param, Query, Render, Res } from '@nestjs/common';
import { Prisma } from '@repo/db';
import { format } from 'date-fns';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('community/financial_news')
export class FinancialNewsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Render('community/financial_news')
  async index(
    @Query('search') search: string = '', // 검색어
    @Query('page') page: string = '1', // 현재 페이지
  ) {
    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = 10;

    const skip = (pageNumber - 1) * limitNumber;
    const take = limitNumber;

    const where: Prisma.FinancialNewsWhereInput = {};

    if (search) {
      where.OR = [
        {
          title: { contains: search },
        },
      ];
    }

    const [financialNews, financialNewsCount] = await Promise.all([
      this.prisma.financialNews.findMany({
        where,
        take,
        skip,
        select: {
          id: true,
          title: true,
          createdAt: true,
          hits: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.financialNews.count({ where }),
    ]);

    const totalPages = Math.ceil(financialNewsCount / limitNumber);
    const visiblePages = 10; // 보여줄 최대 페이지 수
    const half = Math.floor(visiblePages / 2);

    let startPage = Math.max(1, pageNumber - half); // 현재 페이지 기준으로 앞/뒤 페이지
    let endPage = Math.min(totalPages, pageNumber + half); // 끝 페이지 넘지 않도록 제한

    // 시작 페이지가 1일 때 -> 뒤쪽을 채우기
    if (startPage === 1) {
      endPage = Math.min(totalPages, startPage + visiblePages - 1);
    }

    // 끝 페이지일 때 -> 앞쪽을 채우기
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - visiblePages + 1);
    }

    const pages = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    );

    return {
      financialNews: financialNews.map((item) => ({
        ...item,
        createdAt: format(item.createdAt, 'yyyy.MM.dd'),
      })),
      search,
      page: pageNumber,
      pages,
      startPage: 1,
      endPage: totalPages,
      hasPrevPage: pageNumber > 1, // 이전 페이지가 있는지 여부
      hasNextPage: pageNumber < totalPages, // 다음 페이지가 있는지 여부
    };
  }

  @Get('redirect/:id')
  async redirectToExternalLink(@Param('id') id: string, @Res() res: Response) {
    const financialNews = await this.prisma.financialNews.update({
      where: { id: Number(id) },
      data: {
        hits: {
          increment: 1,
        },
      },
    });

    if (!financialNews?.link) {
      return res.status(404).send('Not Found');
    }

    return res.redirect(financialNews.link);
  }
}
