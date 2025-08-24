export class SendDto {
  // 발신자 전화번호 (최대 16bytes)
  sender: string;

  // 수신자 전화번호 - 컴마(,)분기 입력으로 최대 1천명
  receiver: string;

  // 메시지 내용 (1~2,000Byte)
  msg: string;

  // SMS(단문) , LMS(장문), MMS(그림문자) 구분
  msg_type?: 'SMS' | 'LMS' | 'MMS';

  // 문자제목(LMS,MMS만 허용)
  title?: string;

  // %고객명% 치환용 입력
  destination?: string;

  // 예약일 (현재일이상) (YYYYMMDD)
  rdate?: string;

  // 예약시간 - 현재시간기준 10분이후 (HHII)
  rtime?: string;

  // 연동테스트시 Y 적용
  testmode_yn?: 'Y' | 'N';
}
