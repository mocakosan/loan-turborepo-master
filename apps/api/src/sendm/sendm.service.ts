import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { SendDto } from './dto/send.dto';
import { AxiosError } from 'axios';

@Injectable()
export class SendmService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  // 전송
  async send(params: SendDto) {
    const apiKey = this.configService.get('SENDM_API_KEY');
    const userId = this.configService.get('SENDM_USER_ID');

    try {
      const { data } = await firstValueFrom(
        this.httpService
          .post(
            `https://api.sendm.co.kr/v1/sms/send`,
            {
              callerNo: params.sender,
              message: params.msg,
              receiveNos: params.receiver,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'user-id': `${userId}`,
                'api-key': `${apiKey}`,
              },
            },
          )
          .pipe(
            catchError((error: AxiosError) => {
              console.error({ error });
              throw new BadRequestException('SMS 전송을 실패하였습니다.');
            }),
          ),
      );

      if (data?.code !== '0') {
        throw new Error(data?.message || 'SMS 전송을 실패하였습니다.');
      }

      return data;
    } catch (error) {
      console.error('send error:', error);
      throw new Error(error?.message);
    }
  }
}
