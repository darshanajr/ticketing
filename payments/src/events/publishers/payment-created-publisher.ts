import { PaymentCreatedEvent, Publisher, Subjects } from "@djticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
