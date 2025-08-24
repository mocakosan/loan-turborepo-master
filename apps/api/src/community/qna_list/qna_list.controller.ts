import { Controller, Get, Query, Render } from '@nestjs/common';
import { Prisma } from '@repo/db';
import { format } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('community/qna_list')
export class QnaListController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Render('community/qna_list')
  async index(
    @Query('search') search: string = '', // 검색어
    @Query('page') page: string = '1', // 현재 페이지
  ) {
    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = 10;

    const skip = (pageNumber - 1) * limitNumber;
    const take = limitNumber;

    const where: Prisma.QnAWhereInput = {};

    if (search) {
      where.OR = [
        {
          title: { contains: search },
        },
      ];
    }

    const [qnas, qnaCount] = await Promise.all([
      this.prisma.qnA.findMany({
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
      this.prisma.qnA.count({ where }),
    ]);

    const totalPages = Math.ceil(qnaCount / limitNumber);
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
      qnas: qnas.map((item) => ({
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
}
