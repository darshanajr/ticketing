import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from "@djticketing/common";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroup = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const order = await Order.findByEvent(data);
    if (!order) {
      throw new Error("Order not found");
    }
    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    //todo: publish

    msg.ack();
  }
}
