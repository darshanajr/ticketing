import { OrderCancelledEvent, OrderStatus } from "@djticketing/common";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";
import { OrderCancelledListener } from "../order-cancelled-listener";

it("should cancel an order and acknowledge", async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await order.save();
  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: order.version + 1,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  await listener.onMessage(data, msg);

  const cancelledOrder = await Order.findById(order.id);

  expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled);
  expect(msg.ack).toHaveBeenCalled();
});
