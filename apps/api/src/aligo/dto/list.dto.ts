export class ListDto {
  // 페이지번호 (기본 1)
  page?: number;

  // 페이지당 출력갯수 (기본 30) 30~500
  page_size?: number;

  // 조회시작일자 (기본 최근일자) YYYYMMDD
  start_date?: string;
}
