import { IsString, IsBoolean, IsNumberString, IsInt } from 'class-validator';

export class RealWriteDto {
  @IsString({ message: '올바른 제목을 입력해주세요.' })
  title: string;

  @IsString({ message: '올바른 이름을 입력해주세요.' })
  name: string;

  @IsInt({ message: '올바른 지역정보를 입력해주세요.' })
  sido: number;

  @IsBoolean({ message: '올바른 형식의 직업 여부를 입력해주세요.' })
  isJob: boolean;

  @IsNumberString({}, { message: '올바른 나이를 입력해주세요.' })
  age: string;

  @IsString({ message: '올바른 성별을 입력해주세요.' })
  gender: string;

  @IsString({ message: '올바른 희망금액을 입력해주세요.' })
  amount: string;

  @IsBoolean({ message: '올바른 상담 후 결정을 입력해주세요.' })
  isAfterConsult: boolean;

  @IsInt({ message: '올바른 대출종류를 입력해주세요.' })
  category: number;

  @IsString({ message: '올바른 휴대폰번호를 입력해주세요.' })
  phoneNumber: string;

  @IsString({ message: '올바른 문의내용을 입력해주세요.' })
  content: string;

  @IsBoolean({ message: '올바른 마케팅 수신동의를 입력해주세요.' })
  isAgreeMarketing: boolean;
}
