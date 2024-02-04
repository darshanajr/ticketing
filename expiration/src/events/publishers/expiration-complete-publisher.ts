import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@djticketing/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
