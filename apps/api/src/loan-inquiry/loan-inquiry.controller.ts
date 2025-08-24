import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@repo/db';
import { format, formatDistanceToNow, startOfToday } from 'date-fns';
import { ko } from 'date-fns/locale';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentEnterpriser } from 'src/common/decorators/current-enterpriser.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConnectEnterpriserDto } from './dto/connect-enterpriser.dto';
import { Response } from 'express';
import { formatInTimeZone } from 'date-fns-tz';
import { SendmService } from 'src/sendm/sendm.service';

@Controller('loan-inquiry')
export class LoanInquiryController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sendmService: SendmService,
  ) {}

  @Get('realtime')
  async getLoanInquiriesRealtime(
    @Query('lastId') lastId?: number,
    @Query('size') size: number = 10,
  ) {
    const where: Prisma.LoanInquiryWhereInput = lastId
      ? { id: { lt: lastId } }
      : {};

    const loanInquiries = await this.prisma.loanInquiry.findMany({
      where,
      take: size,
      orderBy: { createdAt: 'desc' },
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
    });

    return loanInquiries.map((item) => ({
      ...item,
      amount: new Intl.NumberFormat('ko-KR').format(Number(item.amount)),
      createdAt: format(item.createdAt, 'yyyy-MM-dd'),
      distanceToNow: formatDistanceToNow(item.createdAt, {
        addSuffix: true,
        locale: ko,
      }),
    }));
  }

  @UseGuards(JwtAuthGuard)
  @Post('enterpriser')
  async connectEnterpriser(
    @CurrentEnterpriser() enterpriser: any,
    @Body() body: ConnectEnterpriserDto,
    @Res() res: Response,
  ) {
    try {
      const findEnterpriser = await this.prisma.enterpriser.findUnique({
        where: {
          identity: enterpriser.identity,
        },
        select: {
          id: true,
          companyName: true,
          phoneNumber: true,
        },
      });
      if (!findEnterpriser) {
        throw new Error('사업자 정보가 존재하지 않습니다.');
      }

      const count = await this.prisma.loanInquiry.count({
        where: {
          id: body.loanInquiryId,
          enterprisers: {
            some: {
              identity: enterpriser.identity,
            },
          },
        },
      });
      if (count !== 0) {
        throw new Error('이미 등록한 업체입니다.');
      }

      const loanInquiryRegistrations =
        await this.prisma.loanInquiryRegistration.findMany({
          where: {
            enterpriser: {
              id: findEnterpriser.id,
            },
            startedAt: {
              lte: new Date(
                formatInTimeZone(startOfToday(), 'Asia/Seoul', 'yyyy-MM-dd'),
              ),
            },
            endedAt: {
              gte: new Date(
                formatInTimeZone(startOfToday(), 'Asia/Seoul', 'yyyy-MM-dd'),
              ),
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            count: true,
            _count: {
              select: {
                loanInquiries: true,
              },
            },
          },
        });
      if (!loanInquiryRegistrations.length) {
        throw new Error('등록 가능한 횟수가 없습니다.');
      }

      const isAllUsed = loanInquiryRegistrations.every(
        (item) => item._count.loanInquiries === item.count,
      );
      if (isAllUsed) {
        throw new Error('등록 가능한 횟수가 없습니다.');
      }

      const loanInquiryRegistrationId = loanInquiryRegistrations.find(
        (item) => item._count.loanInquiries < item.count,
      )?.id;

      const loanInquiry = await this.prisma.loanInquiry.update({
        where: {
          id: body.loanInquiryId,
        },
        data: {
          enterprisers: {
            connect: {
              identity: enterpriser.identity,
            },
          },
          loanInquiryRegistrations: {
            connect: {
              id: loanInquiryRegistrationId,
            },
          },
        },
        select: {
          phoneNumber: true,
        },
      });

      await this.sendmService.send({
        sender: '01065027958',
        receiver: `${loanInquiry.phoneNumber}`,
        msg: `[추천대출] 고객님의 대출문의에 상담가능 업체가 등록되었습니다.

▶ 업체명: ${findEnterpriser?.companyName}
▶ 연락처: ${findEnterpriser?.phoneNumber}`,
      });

      return res
        .status(HttpStatus.CREATED)
        .send({ message: '등록을 완료했습니다.' });
    } catch (error) {
      console.error(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: error?.message || '서버 오류' });
    }
  }
}
