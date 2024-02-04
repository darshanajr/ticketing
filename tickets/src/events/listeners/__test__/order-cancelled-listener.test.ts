import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledEvent } from "@djticketing/common";
import { Message } from "node-nats-streaming";
import { OrderCancelledListener } from "../order-cancelled-listener";

it("should throw error if ticket not found", async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  const data: OrderCancelledEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  try {
    await listener.onMessage(data, msg);
  } catch (err) {
    return;
  }

  throw new Error("failed to throw not found");
});

it("should cancel reserved ticket and acknowledge", async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  const ticket = Ticket.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    title: "test",
    price: 10,
  });
  ticket.orderId = new mongoose.Types.ObjectId().toHexString();
  await ticket.save();
  const data: OrderCancelledEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
