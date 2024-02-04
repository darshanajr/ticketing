import { OrderStatus } from "@djticketing/common";
import mongoose from "mongoose";
import { TicketDocument } from "./ticket";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttributes {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDocument;
}

interface OrderDocument extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDocument;
  version: number;
}

interface OrderModel extends mongoose.Model<OrderDocument> {
  build(attr: OrderAttributes): OrderDocument;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
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
orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attr: OrderAttributes) => {
  return new Order(attr);
};

const Order = mongoose.model<OrderDocument, OrderModel>("Order", orderSchema);

export { Order, OrderStatus };
