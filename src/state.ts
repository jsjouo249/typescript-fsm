import { paymentFsm, PaymentStateMachine } from "./stateMachine";
import { DataState, PaymentEventLabel, TransactionMethod } from "./stateType";

export class Payment extends PaymentStateMachine<DataState, PaymentEventLabel> {
  constructor() {
    super();

    this.addTransaction([
      paymentFsm({
        fromOrderState: DataState.PENDING,
        fromTransactionState: DataState.REQUESTED,
        event: PaymentEventLabel.SUCCESS,
        method: TransactionMethod.CARD,
        toOrderState: DataState.COMPLETED,
        toTransactionState: DataState.COMPLETED,
      }), // 대기 -> 결제 성공 -> 결제 완료
      paymentFsm({
        fromOrderState: DataState.PENDING,
        fromTransactionState: DataState.REQUESTED,
        event: PaymentEventLabel.CANCEL,
        method: TransactionMethod.CARD, // 주문 취소시 임의로 카드 결제로 설정
        toOrderState: DataState.DELETED,
        toTransactionState: DataState.PENDING, // 주문 취소시 transaction 은 없는 상태!
      }), // 대기 -> 주문 취소 -> 주문 취소
      paymentFsm({
        fromOrderState: DataState.PENDING,
        fromTransactionState: DataState.REQUESTED,
        event: PaymentEventLabel.ORDER_EXPIRE,
        method: TransactionMethod.CARD,
        toOrderState: DataState.DELETED,
        toTransactionState: DataState.EXPIRED,
      }), // 대기 -> 주문 기간 만료(카드 결제) -> 주문 취소
      paymentFsm({
        fromOrderState: DataState.PENDING,
        fromTransactionState: DataState.REQUESTED,
        event: PaymentEventLabel.ORDER_EXPIRE,
        method: TransactionMethod.VBANK,
        toOrderState: DataState.DELETED,
        toTransactionState: DataState.EXPIRED,
      }), // 대기 -> 주문 기간 만료(가상 계좌) -> 주문 취소
      paymentFsm({
        fromOrderState: DataState.PENDING,
        fromTransactionState: DataState.REQUESTED,
        event: PaymentEventLabel.ORDER_EXPIRE,
        method: TransactionMethod.TRANSFER,
        toOrderState: DataState.DELETED,
        toTransactionState: DataState.EXPIRED,
      }), // 대기 -> 주문 기간 만료(무통장 입금) -> 주문 취소
      paymentFsm({
        fromOrderState: DataState.REQUESTED,
        fromTransactionState: DataState.REQUESTED,
        event: PaymentEventLabel.EXPIRE,
        method: TransactionMethod.TRANSFER,
        toOrderState: DataState.DELETED,
        toTransactionState: DataState.EXPIRED,
      }), // 대기 -> 무통장 입금 기간 만료 -> 주문 취소
      paymentFsm({
        fromOrderState: DataState.REQUESTED,
        fromTransactionState: DataState.PENDING,
        event: PaymentEventLabel.EXPIRE,
        method: TransactionMethod.VBANK,
        toOrderState: DataState.DELETED,
        toTransactionState: DataState.EXPIRED,
      }), // 대기 -> 가상 계좌 입금 기간 만료 -> 주문 취소
      paymentFsm({
        fromOrderState: DataState.PENDING,
        fromTransactionState: DataState.REQUESTED,
        event: PaymentEventLabel.REQUEST,
        method: TransactionMethod.TRANSFER,
        toOrderState: DataState.REQUESTED,
        toTransactionState: DataState.REQUESTED,
      }), // 대기 -> 무통장 입금 결제 요청 -> 결제 요청
      paymentFsm({
        fromOrderState: DataState.REQUESTED,
        fromTransactionState: DataState.REQUESTED,
        event: PaymentEventLabel.CONFIRM,
        method: TransactionMethod.TRANSFER,
        toOrderState: DataState.COMPLETED,
        toTransactionState: DataState.COMPLETED,
      }), // 결제 요청 -> 무통장 입금 확인 -> 결제 완료
      paymentFsm({
        fromOrderState: DataState.PENDING,
        fromTransactionState: DataState.REQUESTED,
        event: PaymentEventLabel.REQUEST,
        method: TransactionMethod.VBANK,
        toOrderState: DataState.REQUESTED,
        toTransactionState: DataState.PENDING,
      }), // 대기 -> 가상 계좌 결제 요청 -> 결제 요청
      paymentFsm({
        fromOrderState: DataState.REQUESTED,
        fromTransactionState: DataState.PENDING,
        event: PaymentEventLabel.CONFIRM,
        method: TransactionMethod.VBANK,
        toOrderState: DataState.COMPLETED,
        toTransactionState: DataState.COMPLETED,
      }), // 결제 요청 -> 가상 계좌 입금 확인 -> 결제 완료
      paymentFsm({
        fromOrderState: DataState.PENDING,
        fromTransactionState: DataState.REQUESTED,
        event: PaymentEventLabel.ERROR,
        method: TransactionMethod.CARD,
        toOrderState: DataState.FAILED,
        toTransactionState: DataState.FAILED,
      }), // 대기 -> 카드 결제시 에러 발생 -> 결제 실패
      paymentFsm({
        fromOrderState: DataState.PENDING,
        fromTransactionState: DataState.REQUESTED,
        event: PaymentEventLabel.ERROR,
        method: TransactionMethod.VBANK,
        toOrderState: DataState.FAILED,
        toTransactionState: DataState.FAILED,
      }), // 대기 -> 가상 계좌 결제시 에러 발생 -> 결제 실패
      paymentFsm({
        fromOrderState: DataState.PENDING,
        fromTransactionState: DataState.REQUESTED,
        event: PaymentEventLabel.ERROR,
        method: TransactionMethod.TRANSFER,
        toOrderState: DataState.FAILED,
        toTransactionState: DataState.FAILED,
      }), // 대기 -> 무통장 입금 결제시 에러 발생 -> 결제 실패
      paymentFsm({
        fromOrderState: DataState.PENDING,
        fromTransactionState: DataState.REQUESTED,
        event: PaymentEventLabel.REFUND,
        method: TransactionMethod.CARD,
        toOrderState: DataState.REFUND_COMPLETED,
        toTransactionState: DataState.COMPLETED,
      }), // 카드 환불 요청(대기) -> 환불 -> 환불 완료
      paymentFsm({
        fromOrderState: DataState.PENDING,
        fromTransactionState: DataState.REQUESTED,
        event: PaymentEventLabel.REFUND,
        method: TransactionMethod.VBANK,
        toOrderState: DataState.REFUND_COMPLETED,
        toTransactionState: DataState.COMPLETED,
      }), // 가상 계좌 환불 요청(대기) -> 환불 -> 환불 완료
      paymentFsm({
        fromOrderState: DataState.PENDING,
        fromTransactionState: DataState.REQUESTED,
        event: PaymentEventLabel.REFUND,
        method: TransactionMethod.TRANSFER,
        toOrderState: DataState.REFUND_COMPLETED,
        toTransactionState: DataState.COMPLETED,
      }), // 무통장 입금 환불 요청(대기) -> 환불 -> 환불 완료
      paymentFsm({
        fromOrderState: DataState.PENDING,
        fromTransactionState: DataState.REQUESTED,
        event: PaymentEventLabel.ERROR,
        method: TransactionMethod.VBANK,
        toOrderState: DataState.FAILED,
        toTransactionState: DataState.FAILED,
      }), // 가상 계좌 선택 -> 가상 계좌 결제 요청 과정에서 에러 -> 결제 실패
    ]);
  }
}
