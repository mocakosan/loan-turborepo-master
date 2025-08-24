export class SendDto {
  // 발신자 전화번호 (최대 16bytes)
  sender: string;

  // 수신자 전화번호 - 컴마(,)분기 입력으로 최대 1천명
  receiver: string;

  // 메시지 내용 (1~2,000Byte)
  msg: string;
}
