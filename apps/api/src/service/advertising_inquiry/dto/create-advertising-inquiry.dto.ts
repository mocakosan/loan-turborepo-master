import { IsInt, IsString } from 'class-validator';

export class CreateAdvertisingInquiryDto {
  @IsInt({ message: '올바른 광고 가이드 ID를 입력해주세요.' })
  advertisingGuideId: number;

  @IsString({ message: '올바른 제목을 입력해주세요.' })
  title: string;
}
