import { Publisher, Subjects, TicketCreatedEvent } from "@djticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
