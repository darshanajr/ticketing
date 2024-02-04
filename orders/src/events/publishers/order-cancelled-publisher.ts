import { OrderCancelledEvent, Publisher, Subjects } from "@djticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
