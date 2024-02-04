import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { OrderCreatedEvent } from "@djticketing/common";
import { Message } from "node-nats-streaming";

it("should throw error if ticket not found", async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date().toISOString(),
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 10,
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

it("should reserve ticket and acknowledge", async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);
  const ticket = Ticket.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    title: "test",
    price: 10,
  });
  await ticket.save();
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date().toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
