import { OrderCreatedEvent, Publisher, Subjects } from "@djticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
