import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttributes {
  id: string;
  title: string;
  price: number;
}

interface TicketDocument extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved: () => Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDocument> {
  build(attr: TicketAttributes): TicketDocument;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDocument | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);
ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);
ticketSchema.statics.build = (attr: TicketAttributes) => {
  return new Ticket({
    _id: attr.id,
    title: attr.title,
    price: attr.price,
  });
};
ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};
ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDocument, TicketModel>(
  "Ticket",
  ticketSchema
);

export { Ticket, TicketDocument };
