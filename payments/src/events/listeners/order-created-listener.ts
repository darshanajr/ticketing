import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@djticketing/common";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroup = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const order = Order.build({
      id: data.id,
      userId: data.userId,
      price: data.ticket.price,
      status: OrderStatus.Created,
    });
    await order.save();

    msg.ack();
  }
}
