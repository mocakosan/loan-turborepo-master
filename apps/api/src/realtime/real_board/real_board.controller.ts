import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { Prisma } from '@repo/db';
import { format } from 'date-fns';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('realtime/real_board')
export class RealBoardController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':id')
  async index(
    @Param('id') id: string = '', // ID
    @Query('field') field: string = '', // 연락처, 이름, 내용
    @Query('search') search: string = '', // 검색어
    @Query('sido') sido: string = '1', // 지역
    @Query('page') page: string = '1', // 현재 페이지
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const idNumber = Number(id);
    if (isNaN(idNumber) || idNumber <= 0) {
      const referer = req.get('Referrer') || '/';
      return res.redirect(referer);
    }

    const loanInquiry = await this.prisma.loanInquiry.findUnique({
      where: {
        id: idNumber,
      },
      select: {
        id: true,
        phoneNumber: true,
        amount: true,
        isAfterConsult: true,
        regionKind: {
          select: {
            name: true,
          },
        },
        isJob: true,
        age: true,
        loanKind: {
          select: {
            name: true,
          },
        },
        gender: true,
        createdAt: true,
        content: true,
        enterprisers: {
          select: {
            companyName: true,
            phoneNumber: true,
          },
        },
      },
    });

    if (!loanInquiry) {
      const referer = req.get('Referrer') || '/';
      return res.redirect(referer);
    }

    // 조회수 증가
    await this.prisma.loanInquiry.update({
      where: {
        id: idNumber,
      },
      data: {
        hits: {
          increment: 1,
        },
      },
    });

    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = 10;

    const skip = (pageNumber - 1) * limitNumber;
    const take = limitNumber;

    const where: Prisma.LoanInquiryWhereInput = {};

    if (search) {
      if (field === 'phoneNumber') {
        where.phoneNumber = { contains: search };
      }

      if (field === 'name') {
        where.name = { contains: search };
      }

      if (field === 'content') {
        where.content = { contains: search };
      }
    }

    const sidoId = Number(sido);
    if (!isNaN(sidoId) && sidoId > 0) {
      where.regionKind = {
        id: sidoId,
      };
    }

    const [regionKinds, loanInquiries, loanInquiryCount] = await Promise.all([
      this.prisma.regionKind.findMany({
        select: {
          id: true,
          name: true,
        },
      }),
      this.prisma.loanInquiry.findMany({
        where,
        take,
        skip,
        select: {
          id: true,
          regionKind: {
            select: {
              id: true,
              name: true,
            },
          },
          title: true,
          name: true,
          createdAt: true,
          hits: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.loanInquiry.count({ where }),
    ]);

    const totalPages = Math.ceil(loanInquiryCount / limitNumber);
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

    return res.render('realtime/real_board', {
      sidoList: regionKinds,
      loanInquiries: loanInquiries.map((item) => ({
        ...item,
        name: !item.name.length
          ? item.name
          : item.name[0] + '*'.repeat(item.name.length - 1),
        createdAt: format(item.createdAt, 'yyyy.MM.dd'),
      })),
      field,
      search,
      sido,
      page: pageNumber,
      pages,
      startPage: 1,
      endPage: totalPages,
      hasPrevPage: pageNumber > 1, // 이전 페이지가 있는지 여부
      hasNextPage: pageNumber < totalPages, // 다음 페이지가 있는지 여부
      loanInquiry: {
        ...loanInquiry,
        phoneNumber: '010-****-****',
        createdAt: format(loanInquiry.createdAt, 'yyyy.MM.dd HH:mm'),
      },
    });
  }
}
