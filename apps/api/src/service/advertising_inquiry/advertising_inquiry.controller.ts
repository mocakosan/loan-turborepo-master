import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Render,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentEnterpriser } from 'src/common/decorators/current-enterpriser.decorator';
import { CreateAdvertisingInquiryDto } from './dto/create-advertising-inquiry.dto';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('service/advertising_inquiry')
export class AdvertisingInquiryController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Render('service/advertising_inquiry')
  async index() {
    const advertisingGuides = await this.prisma.advertisingGuide.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
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

  @UseGuards(JwtAuthGuard)
  @Post()
  async createAdvertisingInquiry(
    @CurrentEnterpriser() enterpriser: any,
    @Body() body: CreateAdvertisingInquiryDto,
    @Res() res: Response,
  ) {
    try {
      await this.prisma.advertisingInquiry.create({
        data: {
          advertisingInquiryKind: body.title,
          status: 'NEW_INQUIRY',
          enterpriser: {
            connect: {
              identity: enterpriser.identity,
            },
          },
          advertisingGuide: {
            connect: {
              id: body.advertisingGuideId,
            },
          },
        },
      });

      return res
        .status(HttpStatus.CREATED)
        .send({ message: '문의하기에 성공했습니다. 연락을 기다려주세요.' });
    } catch (error) {
      console.error(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: error?.message || '서버 오류' });
    }
  }
}
