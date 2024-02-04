import { Publisher, Subjects, TicketUpdatedEvent } from "@djticketing/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
