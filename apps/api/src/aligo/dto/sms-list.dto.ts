export class SmsListDto {
  // 메시지 고유ID
  mid: number;

  // 페이지번호 (기본 1)
  page?: number;

  // 페이지당 출력갯수 (기본 30) 30~500
  page_size?: number;
}
