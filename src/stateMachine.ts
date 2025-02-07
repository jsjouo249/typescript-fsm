import { TransactionMethod, PaymentState, Payment } from "./stateType";

export function paymentFsm<STATE, EVENT, TransactionMethod>({
  fromOrderState,
  fromTransactionState,
  event,
  method,
  toOrderState,
  toTransactionState,
}: {
  fromOrderState: STATE;
  fromTransactionState: STATE;
  event: EVENT;
  method: TransactionMethod;
  toOrderState: STATE;
  toTransactionState: STATE;
}): Payment<STATE, EVENT, TransactionMethod> {
  return { fromOrderState, fromTransactionState, event, method, toOrderState, toTransactionState };
}

export class PaymentStateMachine<STATE, EVENT> {

  constructor(protected payments: Payment<STATE, EVENT, TransactionMethod>[] = []) {
  }

  public addTransaction(payments: Payment<STATE, EVENT, TransactionMethod>[]): void {
    payments.forEach((payment) => this.payments.push(payment));
  }

  validatePaymentState({
    fromOrderState,
    fromTransactionState,
    event,
    method,
  }: {
    fromOrderState: STATE;
    fromTransactionState: STATE;
    event: EVENT;
    method: TransactionMethod;
  }): PaymentState<STATE> {
    const paymentState = this.payments.find(
      (payment) =>
        payment.fromOrderState === fromOrderState &&
        payment.fromTransactionState === fromTransactionState &&
        payment.event === event &&
        payment.method === method,
    );

    return { toOrderState: paymentState.toOrderState, toTransactionState: paymentState.toTransactionState };
  }
}
