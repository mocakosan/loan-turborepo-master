import { IsBoolean, IsBooleanString, IsEmail, IsString } from 'class-validator';

export class CreateEnterpriserDto {
  @IsString({ message: '올바른 대표자명을 입력해주세요.' })
  name: string;

  @IsString({ message: '올바른 아이디를 입력해주세요.' })
  identity: string;

  @IsString({ message: '올바른 비밀번호를 입력해주세요.' })
  password: string;

  @IsEmail({}, { message: '올바른 이메일을 입력해주세요.' })
  email: string;

  @IsString({ message: '올바른 전화번호(대표자명의)를 입력해주세요.' })
  phoneNumber: string;

  @IsString({ message: '올바른 상호명(업체명)를 입력해주세요.' })
  companyName: string;

  @IsString({ message: '올바른 대부(중개)등록번호를 입력해주세요.' })
  registrationNumber: string;

  @IsString({ message: '올바른 등록유효기간 시작일을 입력해주세요.' })
  registrationStartDate: string;

  @IsString({ message: '올바른 등록유효기간 종료일을 입력해주세요.' })
  registrationEndDate: string;

  @IsString({ message: '올바른 대출광고 전화번호를 입력해주세요.' })
  advertisingPhoneNumber: string;

  @IsString({ message: '올바른 사업장 소재지를 입력해주세요.' })
  zip: string;

  @IsString({ message: '올바른 사업장 소재지를 입력해주세요.' })
  address: string;

  @IsString({ message: '올바른 사업장 소재지를 입력해주세요.' })
  addressDetail: string;

  @IsString({ message: '올바른 대부업 등록기관을 입력해주세요.' })
  registrationAuthority: string;

  @IsString({ message: '올바른 대부업 등록기관 전화번호를 입력해주세요.' })
  registrationAuthorityPhoneNumber: string;

  @IsBooleanString({ message: '올바른 대출문의 SMS 수신 여부를 입력해주세요.' })
  isReceiveSMS: string;
}
