import {
  Body,
  Controller,
  HttpStatus,
  Patch,
  Post,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateEnterpriserDto } from './dto/create-enterpriser.dto';
import { Response } from 'express';
import * as argon2 from 'argon2';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupabaseService } from 'src/supabase/supabase.service';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentEnterpriser } from 'src/common/decorators/current-enterpriser.decorator';
import { SendmService } from 'src/sendm/sendm.service';

@Controller('enterprisers')
export class EnterprisersController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabaseService: SupabaseService,
    private readonly configService: ConfigService,
    private readonly sendmService: SendmService,
  ) {}

  // 아이디 중복확인
  @Post('check-identity')
  async checkIdentity(
    @Body('identity') identity: string = '', // 아이디
    @Res() res: Response,
  ) {
    try {
      const identityCount = await this.prisma.enterpriser.count({
        where: {
          identity,
        },
      });
      if (identityCount > 0) {
        throw new Error('사용할 수 없는 아이디입니다.');
      }

      return res
        .status(HttpStatus.OK)
        .send({ message: '사용 가능한 아이디입니다.' });
    } catch (error) {
      console.error(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: error?.message || '서버 오류' });
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
      console.error('sendVerification error:', error);
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

  // 새 비밀번호 > 인증번호 발송
  @Post('new-password/send-verification')
  async newPasswordSendVerification(
    @Body('phoneNumber') phoneNumber: string = '', // 휴대폰 번호
    @Res() res: Response,
  ) {
    try {
      const phoneNumberCount = await this.prisma.enterpriser.count({
        where: {
          phoneNumber: phoneNumber.replace(/\D/g, ''),
        },
      });
      if (phoneNumberCount === 0) {
        throw new Error('입력하신 휴대폰 번호에 해당하는 계정이 없습니다.');
      }

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
      console.error('sendVerification error:', error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: error?.message || '서버 오류' });
    }
  }

  // 인증번호 확인
  @Post('new-password/verify-code')
  async newPasswordVerifyCode(
    @Body('phoneNumber') phoneNumber: string = '', // 휴대폰 번호
    @Body('verificationCode') verificationCode: string = '', // 인증번호
    @Res() res: Response,
  ) {
    try {
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

  // 새 비밀번호 수정
  @Post('new-password')
  async newPassword(
    @Body('phoneNumber') phoneNumber: string = '', // 휴대폰 번호
    @Body('verificationCode') verificationCode: string = '', // 인증번호
    @Body('password') password: string = '', // 새 비밀번호
    @Res() res: Response,
  ) {
    try {
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

      const hashedPassword = await argon2.hash(password);

      await this.prisma.$transaction([
        // 인증 성공 시 삭제
        this.prisma.verification.delete({
          where: { phoneNumber },
        }),
        // 비밀번호 변경
        this.prisma.enterpriser.update({
          where: {
            phoneNumber,
          },
          data: {
            password: hashedPassword,
          },
        }),
      ]);

      return res.status(HttpStatus.OK).send({
        message:
          '비밀번호가 안전하게 변경되었습니다. 새로운 비밀번호로 로그인해주세요.',
      });
    } catch (error) {
      console.error(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: error?.message || '서버 오류' });
    }
  }

  // 사업자 생성
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'loanLicense', maxCount: 1 },
      { name: 'businessLicense', maxCount: 1 },
    ]),
  )
  async createEnterpriser(
    @Body() body: CreateEnterpriserDto,
    @Res() res: Response,
    @UploadedFiles()
    files: {
      loanLicense: Express.Multer.File[];
      businessLicense: Express.Multer.File[] | undefined;
    },
  ) {
    try {
      const identityCount = await this.prisma.enterpriser.count({
        where: {
          identity: body.identity,
        },
      });
      if (identityCount > 0) {
        throw new Error('사용할 수 없는 아이디입니다.');
      }

      const emailCount = await this.prisma.enterpriser.count({
        where: {
          email: body.email,
        },
      });
      if (emailCount > 0) {
        throw new Error('사용할 수 없는 이메일입니다.');
      }

      const phoneCount = await this.prisma.enterpriser.count({
        where: {
          phoneNumber: body.phoneNumber.replace(/\D/g, ''),
        },
      });
      if (phoneCount > 0) {
        throw new Error('이미 존재하는 계정의 휴대폰 번호입니다.');
      }

      if (files.loanLicense.length !== 1 || files.loanLicense.length > 1) {
        throw new Error('대부업 등록증의 개수가 올바르지 않습니다.');
      }

      if (files.businessLicense && files.businessLicense.length > 1) {
        throw new Error('사업자 등록증은 1장만 입력가능합니다.');
      }

      const loanLicenseFile = files.loanLicense[0];
      const businessLicenseFile = files.businessLicense
        ? files.businessLicense[0]
        : null;

      const supabase = this.supabaseService.getClient();

      const uploadFiles = [{ key: 'loanLicense', file: loanLicenseFile }];
      if (businessLicenseFile) {
        uploadFiles.push({ key: 'businessLicense', file: businessLicenseFile });
      }

      const uploadResults = await Promise.all(
        uploadFiles.map(async ({ key, file }) => {
          const path = `${uuidv4()}.${file.originalname.split('.').pop()}`;
          const fileBody = file.buffer;

          const { data, error } = await supabase.storage
            .from(this.configService.get('SUPABASE_IMAGE_BUCKET')!)
            .upload(path, fileBody, {
              contentType: file.mimetype,
              upsert: false,
            });

          if (error) {
            console.error(error);
            throw new Error('파일 업로드를 실패했습니다.');
          }

          const { publicUrl } = supabase.storage
            .from(this.configService.get('SUPABASE_IMAGE_BUCKET')!)
            .getPublicUrl(data.path).data;

          return { key, publicUrl };
        }),
      );

      const hashedPassword = await argon2.hash(body.password);

      await this.prisma.enterpriser.create({
        data: {
          name: body.name,
          identity: body.identity,
          password: hashedPassword,
          email: body.email,
          phoneNumber: body.phoneNumber.replace(/\D/g, ''),
          companyName: body.companyName,
          registrationNumber: body.registrationNumber,
          registrationStartDate: body.registrationStartDate,
          registrationEndDate: body.registrationEndDate,
          advertisingPhoneNumber: body.advertisingPhoneNumber,
          zip: body.zip,
          address: body.address,
          addressDetail: body.addressDetail,
          registrationAuthority: body.registrationAuthority,
          registrationAuthorityPhoneNumber:
            body.registrationAuthorityPhoneNumber,

          loanLicense:
            uploadResults.find((item) => item.key === 'loanLicense')
              ?.publicUrl || '',
          businessLicense:
            uploadResults.find((item) => item.key === 'businessLicense')
              ?.publicUrl || '',

          isReceiveSMS: body.isReceiveSMS === 'true',
        },
      });

      return res.status(HttpStatus.CREATED).send({ message: '생성 완료' });
    } catch (error) {
      console.error(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: error?.message || '서버 오류' });
    }
  }

  // 아이디 변경
  @UseGuards(JwtAuthGuard)
  @Patch('identity')
  async updateIdentity(
    @CurrentEnterpriser() enterpriser: any,
    @Body('identity') identity: string,
    @Res() res: Response,
  ) {
    try {
      const exists = await this.prisma.enterpriser.findUnique({
        where: {
          identity,
        },
      });
      if (exists) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send({ message: '이미 사용 중인 아이디입니다.' });
      }

      await this.prisma.enterpriser.update({
        where: {
          identity: enterpriser.identity,
        },
        data: {
          identity,
        },
      });

      // 쿠키 삭제
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: false, // TODO: HTTPS에서만 사용 (개발 시 false)
      });

      return res.status(HttpStatus.OK).send({
        message: '아이디가 변경되었습니다.\n다시 로그인 해주시기 바랍니다.',
      });
    } catch (error) {
      console.error(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: error?.message || '서버 오류' });
    }
  }

  // 휴대폰 변경
  @UseGuards(JwtAuthGuard)
  @Patch('phoneNumber')
  async updatePhoneNumber(
    @CurrentEnterpriser() enterpriser: any,
    @Body('phoneNumber') phoneNumber: string,
    @Res() res: Response,
  ) {
    try {
      await this.prisma.enterpriser.update({
        where: {
          identity: enterpriser.identity,
        },
        data: {
          phoneNumber,
        },
      });

      return res.status(HttpStatus.OK).send({
        message: '연락처가 변경되었습니다.',
      });
    } catch (error) {
      console.error(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: error?.message || '서버 오류' });
    }
  }

  // 비밀번호 검증
  @UseGuards(JwtAuthGuard)
  @Post('check-password')
  async checkPassword(
    @CurrentEnterpriser() enterpriser: any,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    try {
      const findEnterpriser = await this.prisma.enterpriser.findUnique({
        where: {
          identity: enterpriser.identity,
        },
        select: {
          password: true,
        },
      });
      if (!findEnterpriser) {
        throw new Error('존재하지 않는 계정입니다.');
      }

      const isVerifyPassword = await argon2.verify(
        findEnterpriser.password,
        password,
      );
      if (!isVerifyPassword) {
        throw new Error('비밀번호가 올바르지 않습니다.');
      }

      return res.status(HttpStatus.OK).send({
        message: '비밀번호가 일치합니다.',
      });
    } catch (error) {
      console.error(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: error?.message || '서버 오류' });
    }
  }

  // 비밀번호 변경
  @UseGuards(JwtAuthGuard)
  @Patch('password')
  async updatePassword(
    @CurrentEnterpriser() enterpriser: any,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    try {
      const hashedPassword = await argon2.hash(password);

      await this.prisma.enterpriser.update({
        where: {
          identity: enterpriser.identity,
        },
        data: {
          password: hashedPassword,
        },
      });

      return res.status(HttpStatus.OK).send({
        message: '비밀번호가 변경되었습니다.',
      });
    } catch (error) {
      console.error(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: error?.message || '서버 오류' });
    }
  }
}
