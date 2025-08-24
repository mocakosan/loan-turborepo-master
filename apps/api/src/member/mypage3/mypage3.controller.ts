import { Controller, Get, Render, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentEnterpriser } from 'src/common/decorators/current-enterpriser.decorator';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('member/mypage3')
export class Mypage3Controller {
  constructor(private readonly prisma: PrismaService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @Render('member/mypage3')
  async index(@CurrentEnterpriser() enterpriser: any) {
    const advertisingGuides = await this.prisma.advertisingGuide.findMany({
      where: {
        advertisingInquiries: {
          some: {
            enterpriser: {
              identity: enterpriser.identity,
            },
          },
        },
      },
      select: {
        title: true,
        amount: true,
        standard: true,
        position: true,
        description: true,
      },
    });

    return {
      advertisingGuides: advertisingGuides.map((item) => ({
        ...item,
        amount: new Intl.NumberFormat('ko-KR').format(Number(item.amount)),
      })),
    };
  }
}
