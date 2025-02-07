import { DataState, PaymentEventLabel, TransactionMethod } from "../stateType";
import { Payment } from "../state";

describe("Payment State Machine tests", () => {
  describe("정상적인 결제 상태 전이 테스트", () => {
    test("카드 결제 성공시 주문서와 결제 상태는 모두 COMPLETED 가 되어야 한다.", () => {
      const payment = new Payment();
      expect(
        payment.validatePaymentState({
          fromOrderState: DataState.PENDING,
          fromTransactionState: DataState.REQUESTED,
          event: PaymentEventLabel.SUCCESS,
          method: TransactionMethod.CARD,
        }),
      ).toEqual({
        toOrderState: DataState.COMPLETED,
        toTransactionState: DataState.COMPLETED,
      });
    });
    test("주문 취소시 주문서 상태는 DELETED 가 되어야 한다. (결제는 생성되지 않는 단계라서 임시로 PENDING)", () => {
      const payment = new Payment();
      expect(
        payment.validatePaymentState({
          fromOrderState: DataState.PENDING,
          fromTransactionState: DataState.REQUESTED,
          event: PaymentEventLabel.CANCEL,
          method: TransactionMethod.CARD,
        }),
      ).toEqual({
        toOrderState: DataState.DELETED,
        toTransactionState: DataState.PENDING,
      });
    });
    test("주문 기간 만료시 주문서 상태는 DELETED, 결제 상태는 EXPIRED 가 되어야 한다.", () => {
      const payment = new Payment();
      expect(
        payment.validatePaymentState({
          fromOrderState: DataState.PENDING,
          fromTransactionState: DataState.REQUESTED,
          event: PaymentEventLabel.ORDER_EXPIRE,
          method: TransactionMethod.CARD,
        }),
      ).toEqual({
        toOrderState: DataState.DELETED,
        toTransactionState: DataState.EXPIRED,
      });
    });
    test("무통장 입금 기간 만료시 주문서 상태는 DELETED, 결제 상태는 EXPIRED 가 되어야 한다.", () => {
      const payment = new Payment();
      expect(
        payment.validatePaymentState({
          fromOrderState: DataState.REQUESTED,
          fromTransactionState: DataState.REQUESTED,
          event: PaymentEventLabel.EXPIRE,
          method: TransactionMethod.TRANSFER,
        }),
      ).toEqual({
        toOrderState: DataState.DELETED,
        toTransactionState: DataState.EXPIRED,
      });
    });
    test("가상 계좌 선택시 에러가 발생하면 주문서 상태는 FAILED, 결제 상태는 FAILED 가 되어야 한다.", () => {
      const payment = new Payment();
      expect(
        payment.validatePaymentState({
          fromOrderState: DataState.PENDING,
          fromTransactionState: DataState.REQUESTED,
          event: PaymentEventLabel.ERROR,
          method: TransactionMethod.VBANK,
        }),
      ).toEqual({
        toOrderState: DataState.FAILED,
        toTransactionState: DataState.FAILED,
      });
    });
    test("가상 계좌 결제 요청 후 기간 만료시에도 주문서 상태는 DELETED, 결제 상태는 EXPIRED 가 되어야 한다.", () => {
      const payment = new Payment();
      expect(
        payment.validatePaymentState({
          fromOrderState: DataState.REQUESTED,
          fromTransactionState: DataState.PENDING,
          event: PaymentEventLabel.EXPIRE,
          method: TransactionMethod.VBANK,
        }),
      ).toEqual({
        toOrderState: DataState.DELETED,
        toTransactionState: DataState.EXPIRED,
      });
    });
    test("무통장 입금 결제 요청시 주문서와 결제 상태는 모두 REQUESTED 가 되어야 한다.", () => {
      const payment = new Payment();
      expect(
        payment.validatePaymentState({
          fromOrderState: DataState.PENDING,
          fromTransactionState: DataState.REQUESTED,
          event: PaymentEventLabel.REQUEST,
          method: TransactionMethod.TRANSFER,
        }),
      ).toEqual({
        toOrderState: DataState.REQUESTED,
        toTransactionState: DataState.REQUESTED,
      });
    });
    test("무통장 입금 요청 후 확인시 주문서와 결제 상태는 모두 COMPLETED 가 되어야 한다.", () => {
      const payment = new Payment();
      expect(
        payment.validatePaymentState({
          fromOrderState: DataState.REQUESTED,
          fromTransactionState: DataState.REQUESTED,
          event: PaymentEventLabel.CONFIRM,
          method: TransactionMethod.TRANSFER,
        }),
      ).toEqual({
        toOrderState: DataState.COMPLETED,
        toTransactionState: DataState.COMPLETED,
      });
    });
    test("가상 계좌 결제 요청시 주문서 상태는 REQUESTED, 결제 상태는 PENDING 이 되어야 한다.", () => {
      const payment = new Payment();
      expect(
        payment.validatePaymentState({
          fromOrderState: DataState.PENDING,
          fromTransactionState: DataState.REQUESTED,
          event: PaymentEventLabel.REQUEST,
          method: TransactionMethod.VBANK,
        }),
      ).toEqual({
        toOrderState: DataState.REQUESTED,
        toTransactionState: DataState.PENDING,
      });
    });
    test("가상 계좌 요청 후 입금 확인시 주문서와 결제 상태는 모두 COMPLETED 가 되어야 한다.", () => {
      const payment = new Payment();
      expect(
        payment.validatePaymentState({
          fromOrderState: DataState.REQUESTED,
          fromTransactionState: DataState.PENDING,
          event: PaymentEventLabel.CONFIRM,
          method: TransactionMethod.VBANK,
        }),
      ).toEqual({
        toOrderState: DataState.COMPLETED,
        toTransactionState: DataState.COMPLETED,
      });
    });
    test("에러 발생 및 결제 실패시 주문서와 결제 상태는 모두 FAILED 가 되어야 한다.", () => {
      const payment = new Payment();
      expect(
        payment.validatePaymentState({
          fromOrderState: DataState.PENDING,
          fromTransactionState: DataState.REQUESTED,
          event: PaymentEventLabel.ERROR,
          method: TransactionMethod.CARD,
        }),
      ).toEqual({
        toOrderState: DataState.FAILED,
        toTransactionState: DataState.FAILED,
      });
    });
    test("환불 요청 후 완료시 주문서 상태는 REFUND_PAID, 결제 상태는 COMPLETED 가 되어야 한다.", () => {
      const payment = new Payment();
      expect(
        payment.validatePaymentState({
          fromOrderState: DataState.PENDING,
          fromTransactionState: DataState.REQUESTED,
          event: PaymentEventLabel.REFUND,
          method: TransactionMethod.CARD,
        }),
      ).toEqual({
        toOrderState: DataState.REFUND_COMPLETED,
        toTransactionState: DataState.COMPLETED,
      });
    });
  });
  describe("비정상적인 결제 상태 전이 테스트", () => {
    test("이미 결제가 완료된 주문서와 결제 상태에서는 결제 성공 이벤트로 상태를 변경하면 안된다.", () => {
      const payment = new Payment();
      expect(() =>
        payment.validatePaymentState({
          fromOrderState: DataState.COMPLETED,
          fromTransactionState: DataState.COMPLETED,
          event: PaymentEventLabel.SUCCESS,
          method: TransactionMethod.CARD,
        }),
      ).toThrow();
    });
    test("취소된 주문서와 결제 상태에서는 에러 이벤트로 상태를 변경하면 안된다.", () => {
      const payment = new Payment();
      expect(() =>
        payment.validatePaymentState({
          fromOrderState: DataState.DELETED,
          fromTransactionState: DataState.DELETED,
          event: PaymentEventLabel.ERROR,
          method: TransactionMethod.CARD,
        }),
      ).toThrow();
    });
    test("결제 실패된 주문서와 결제 상태에서는 에러 이벤트로 상태를 변경하면 안된다.", () => {
      const payment = new Payment();
      expect(() =>
        payment.validatePaymentState({
          fromOrderState: DataState.FAILED,
          fromTransactionState: DataState.FAILED,
          event: PaymentEventLabel.ERROR,
          method: TransactionMethod.CARD,
        }),
      ).toThrow();
    });
  });
});
