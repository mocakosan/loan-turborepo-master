import { Controller, Get, Render } from '@nestjs/common';
import { format } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('community/community_intro')
export class CommunityIntroController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Render('community/community_intro')
  async index() {
    const inquiries = await this.prisma.inquiry.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    });

    const loanNews = await this.prisma.loanNews.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    });

    const financialNews = await this.prisma.financialNews.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    });

    return {
      inquiries: inquiries.map((item) => ({
        ...item,
        createdAt: format(item.createdAt, 'yyyy-MM-dd'),
      })),
      loanNews: loanNews.map((item) => ({
        ...item,
        createdAt: format(item.createdAt, 'yyyy-MM-dd'),
      })),
      financialNews: financialNews.map((item) => ({
        ...item,
        createdAt: format(item.createdAt, 'yyyy-MM-dd'),
      })),
    };
  }
}
