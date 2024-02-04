import { TicketCreatedEvent } from "@djticketing/common";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

it("should creates a ticket and acknowledge", async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);
  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    title: "test",
    price: 10,
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);

  expect(ticket).not.toBeNull();
  expect(msg.ack).toHaveBeenCalled();
});
