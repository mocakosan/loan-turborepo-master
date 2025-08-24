import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { SendDto } from './dto/send.dto';
import { ListDto } from './dto/list.dto';
import { SmsListDto } from './dto/sms-list.dto';

@Injectable()
export class AligoService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  // 전송
  async send(params: SendDto) {
    const smsUrl = this.configService.get('ALIGO_SMS_URL');
    const key = this.configService.get('ALIGO_API_KEY');
    const user_id = this.configService.get('ALIGO_USER_ID');

    try {
      const { data } = await firstValueFrom(
        this.httpService
          .post(`${smsUrl}/send/`, null, {
            params: {
              key,
              user_id,
              ...params,
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              console.error({ error });
              throw new BadRequestException('SMS 전송을 실패하였습니다.');
            }),
          ),
      );

      if (data?.result_code < 1) {
        throw new Error(data?.message || 'SMS 전송을 실패하였습니다.');
      }

      return data;
    } catch (error) {
      console.error('send error:', error);
      throw new Error(error?.message);
    }
  }

  // 전송내역조회
  async list(params: ListDto) {
    const smsUrl = this.configService.get('ALIGO_SMS_URL');
    const key = this.configService.get('ALIGO_API_KEY');
    const user_id = this.configService.get('ALIGO_USER_ID');

    const { data } = await firstValueFrom(
      this.httpService
        .post(`${smsUrl}/list/`, null, {
          params: {
            key,
            user_id,
            ...params,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error({ error });
            throw new BadRequestException('전송내역조회를 실패하였습니다.');
          }),
        ),
    );

    return data;
  }

  // 전송결과조회(상세)
  async smsList(params: SmsListDto) {
    const smsUrl = this.configService.get('ALIGO_SMS_URL');
    const key = this.configService.get('ALIGO_API_KEY');
    const user_id = this.configService.get('ALIGO_USER_ID');

    const { data } = await firstValueFrom(
      this.httpService
        .post(`${smsUrl}/sms_list/`, null, {
          params: {
            key,
            user_id,
            ...params,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error({ error });
            throw new BadRequestException('전송결과조회를 실패하였습니다.');
          }),
        ),
    );

    return data;
  }

  // 발송가능건수
  async remain() {
    const smsUrl = this.configService.get('ALIGO_SMS_URL');
    const key = this.configService.get('ALIGO_API_KEY');
    const user_id = this.configService.get('ALIGO_USER_ID');

    const { data } = await firstValueFrom(
      this.httpService
        .post(`${smsUrl}/remain/`, null, {
          params: {
            key,
            user_id,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error({ error });
            throw new BadRequestException(
              '발송가능건수 조회를 실패하였습니다.',
            );
          }),
        ),
    );

    return data;
  }
}
