import { ExpirationCompleteEvent, OrderStatus } from "@djticketing/common";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";

it("should cancel order and acknowledge", async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);
  const ticket = Ticket.build({
    title: "test",
    price: 10,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();
  const order = Order.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();
  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  await listener.onMessage(data, msg);

  const cancelledOrder = await Order.findById(order.id);

  expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled);
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
