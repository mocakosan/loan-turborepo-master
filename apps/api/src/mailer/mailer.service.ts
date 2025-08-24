import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: NestMailerService) {}

  /**
   * 아이디, 비밀번호 정보 메일 발송
   * @param to - 받는 사람 이메일
   * @returns
   */
  sendEmailAuthNumber(
    to: string,
    identity: string,
    password: string,
  ): Promise<boolean> {
    return this.mailerService
      .sendMail({
        to,
        from: `[추천대출]`,
        subject: '[추천대출] 회원정보 찾기',
        template: './find-email-and-password',
        context: {
          identity,
          password,
        },
      })
      .then((result) => {
        console.log({ result });

        return true;
      })
      .catch((error) => {
        console.error({ error });

        return false;
      });
  }
}
