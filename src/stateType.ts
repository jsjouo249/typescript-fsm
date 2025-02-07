export enum DataState {
  READY = "READY",
  PENDING = "PENDING",
  ONGOING = "ONGOING",
  NORMAL = "NORMAL",
  HIDDEN = "HIDDEN",
  FAILED = "FAILED",
  DISCLAIMED = "DISCLAIMED",
  DELETED = "DELETED",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
  APPLYING = "APPLYING",
  PLANNING = "PLANNING",
  FULFILLED = "FULFILLED",
  CLOSED = "CLOSED",
  ENDED = "ENDED",
  PAID = "PAID",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
  REFUND_COMPLETED = "REFUND_COMPLETED",
  APPROVED = "APPROVED",
  REQUESTED = "REQUESTED",
}

export enum PaymentEventLabel {
  "SUCCESS" = "SUCCESS", // 결제 성공
  "CANCEL" = "CANCEL", // 주문 취소
  "ORDER_EXPIRE" = "ORDER_EXPIRE", // 주문 기간 만료
  "EXPIRE" = "EXPIRE", // 기간 만료
  "REQUEST" = "REQUEST", // 결제 요청
  "CONFIRM" = "CONFIRM", // 입금 확인
  "ERROR" = "ERROR", // 결제 실패
  "REFUND" = "REFUND", // 환불
}

export enum TransactionMethod {
  CARD = "CARD",
  TRANSFER = "TRANSFER", //무통장
  VBANK = "VBANK", //가상계좌
}

export type Payment<STATE, EVENT, TransactionMethod> = {
  fromOrderState: STATE;
  fromTransactionState: STATE;
  event: EVENT;
  method: TransactionMethod;
  toOrderState: STATE;
  toTransactionState: STATE;
};

export type PaymentState<STATE> = {
  toOrderState: STATE;
  toTransactionState: STATE;
};
