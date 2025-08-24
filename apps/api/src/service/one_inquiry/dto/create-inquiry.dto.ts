import { InquiryKind } from '@repo/db';
import { IsString, IsEnum } from 'class-validator';

export class CreateInquiryDto {
  @IsString({ message: '올바른 제목을 입력해주세요.' })
  title: string;

  @IsString({ message: '올바른 이름을 입력해주세요.' })
  name: string;

  @IsEnum(InquiryKind, { message: '올바른 문의유형을 선택해주세요.' })
  inquiryKind: InquiryKind;

  @IsString({ message: '올바른 휴대폰 번호를 입력해주세요.' })
  phoneNumber: string;

  @IsString({ message: '올바른 문의내용을 입력해주세요.' })
  content: string;
}
