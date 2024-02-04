import { OrderStatus, PaymentCreatedEvent } from "@djticketing/common";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { PaymentCreatedListener } from "../payment-created-listener";
import { Order } from "../../../models/order";

it.todo(
  "should update order status and acknowledge"
  // , async () => {
  //   const listener = new PaymentCreatedListener(natsWrapper.client);
  //   const order = Order.build({
  //     userId: new mongoose.Types.ObjectId().toHexString(),
  //     status: OrderStatus.AwaitingPayment,
  //     expiresAt: new Date(),
  //     ticket: {
  //       title: "test",
  //       price: 10,
  //       version: 0,
  //     }
  //   })
  //   const data: PaymentCreatedEvent["data"] = {
  //     id: new mongoose.Types.ObjectId().toHexString(),
  //     orderId: new mongoose.Types.ObjectId().toHexString(),
  //     stripeId: "stripeId",
  //   };
  //   // @ts-ignore
  //   const msg: Message = {
  //     ack: jest.fn(),
  //   };

  //   await listener.onMessage(data, msg);

  //   const updatedOrder = await Order.findById(data.orderId);

  //   expect(updatedOrder!.status).toEqual(OrderStatus.Complete);
  //   expect(msg.ack).toHaveBeenCalled();
  // }
);
