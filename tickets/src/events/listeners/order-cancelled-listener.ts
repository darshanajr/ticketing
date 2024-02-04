import { Listener, OrderCancelledEvent, Subjects } from "@djticketing/common";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket_updated_publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroup = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ orderId: undefined });
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      userId: ticket.userId,
      title: ticket.title,
      price: ticket.price,
      version: ticket.version,
    });

    msg.ack();
  }
}
