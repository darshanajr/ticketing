import { Listener, Subjects, TicketUpdatedEvent } from "@djticketing/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroup = QUEUE_GROUP_NAME;

  async onMessage(data: TicketUpdatedEvent["data"], message: Message) {
    const { title, price } = data;
    const ticket = await Ticket.findByEvent(data);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    ticket.set({ title, price });
    await ticket.save();

    message.ack();
  }
}
