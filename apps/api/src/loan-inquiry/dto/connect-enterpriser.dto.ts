import { IsInt } from 'class-validator';

export class ConnectEnterpriserDto {
  @IsInt({ message: '올바른 대출문의 ID를 입력해주세요.' })
  loanInquiryId: number;
}
