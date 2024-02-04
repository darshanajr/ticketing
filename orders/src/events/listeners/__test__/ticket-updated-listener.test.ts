import { TicketUpdatedEvent } from "@djticketing/common";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

it("should throw exception when ticket not found", async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);
  const data: TicketUpdatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    title: "test",
    price: 10,
    version: 1,
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

  throw new Error("failed to throw not found error");
});

it("should throw exception when ticket version not correct", async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 5,
    title: "test",
  });
  await ticket.save();
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    userId: new mongoose.Types.ObjectId().toHexString(),
    title: "test",
    price: 10,
    version: 2,
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

  throw new Error("failed to throw not found error");
});

it("should create ticket and acknowledge", async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 5,
    title: "test",
  });
  await ticket.save();
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    userId: new mongoose.Types.ObjectId().toHexString(),
    title: "test",
    price: 10,
    version: 1,
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.price).toEqual(data.price);
  expect(msg.ack).toHaveBeenCalled();
});
