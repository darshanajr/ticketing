export enum OrderStatus {
  /** order created but not reserved */
  Created = "created",
  /** order cancelled by user or payment failure or reserve expiration */
  Cancelled = "cancelled",
  /** order reserved and waiting for payment */
  AwaitingPayment = "awaiting:payment",
  /** order payment is successful */
  Complete = "complete",
}
