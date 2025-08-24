import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Render,
  Res,
} from '@nestjs/common';
import { RealWriteDto } from './dto/real_write.dto';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendmService } from 'src/sendm/sendm.service';

@Controller('realtime/real_write')
export class RealWriteController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sendmService: SendmService,
  ) {}

  @Get()
  @Render('realtime/real_write')
  async index() {
    const [regionKinds, loanKinds] = await Promise.all([
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
    ]);

    return {
      sidoList: regionKinds,
      loanList: loanKinds,
    };
  }

  @Post()
  async createLoanInquiry(@Body() body: RealWriteDto, @Res() res: Response) {
    try {
      await this.prisma.$transaction([
        this.prisma.loanInquiryCount.update({
          where: {
            id: 1,
          },
          data: {
            count: { increment: 1 },
          },
        }),
        this.prisma.loanInquiry.create({
          data: {
            title: body.title,
            name: body.name,
            isJob: body.isJob,
            age: body.age,
            gender: body.gender,
            amount: body.amount,
            isAfterConsult: body.isAfterConsult,
            phoneNumber: body.phoneNumber,
            content: body.content,
            isAgreeMarketing: body.isAgreeMarketing,
            regionKind: {
              connect: {
                id: body.sido,
              },
            },
            loanKind: {
              connect: {
                id: body.category,
              },
            },
          },
        }),
      ]);

      return res.status(HttpStatus.CREATED).send({ message: '생성 완료' });
    } catch (error) {
      console.error(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: '서버 오류' });
    }
  }

  // 인증번호 발송
  @Post('send-verification')
  async sendVerification(
    @Body('phoneNumber') phoneNumber: string = '', // 휴대폰 번호
    @Res() res: Response,
  ) {
    try {
      // 6자리 인증번호 생성
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();
      console.log({ phoneNumber, verificationCode });

      await this.sendmService.send({
        sender: '01065027958',
        receiver: phoneNumber,
        msg: `[추천대출] 인증번호는 ${verificationCode} 입니다.`,
      });

      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5분

      await this.prisma.verification.upsert({
        where: {
          phoneNumber,
        },
        update: {
          code: verificationCode,
          expiresAt,
        },
        create: {
          phoneNumber,
          code: verificationCode,
          expiresAt,
        },
      });

      return res
        .status(HttpStatus.OK)
        .send({ message: '인증번호가 발송되었습니다.' });
    } catch (error) {
      console.error(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: error?.message || '서버 오류' });
    }
  }

  // 인증번호 확인
  @Post('verify-code')
  async verifyCode(
    @Body('phoneNumber') phoneNumber: string = '', // 휴대폰 번호
    @Body('verificationCode') verificationCode: string = '', // 인증번호
    @Res() res: Response,
  ) {
    try {
      console.log({ phoneNumber, verificationCode });

      const storedVerification = await this.prisma.verification.findUnique({
        where: { phoneNumber },
        select: {
          code: true,
          expiresAt: true,
        },
      });

      if (!storedVerification) {
        throw new Error('인증번호가 만료되었거나 존재하지 않습니다.');
      }

      if (new Date(storedVerification.expiresAt) < new Date()) {
        await this.prisma.verification.delete({
          where: { phoneNumber },
        });

        throw new Error('인증번호가 만료되었습니다.');
      }

      if (storedVerification.code !== verificationCode) {
        throw new Error('인증번호가 올바르지 않습니다.');
      }

      // 인증 성공 시 삭제
      await this.prisma.verification.delete({
        where: { phoneNumber },
      });

      return res
        .status(HttpStatus.OK)
        .send({ message: '인증번호 확인이 완료되었습니다.' });
    } catch (error) {
      console.error(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: error?.message || '서버 오류' });
    }
  }
}
