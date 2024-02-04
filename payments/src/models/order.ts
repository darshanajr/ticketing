import { OrderStatus } from "@djticketing/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttributes {
  id: string;
  status: OrderStatus;
  userId: string;
  price: number;
}

interface OrderDocument extends mongoose.Document {
  status: OrderStatus;
  userId: string;
  price: number;
  version: number;
}

interface OrderModel extends mongoose.Model<OrderDocument> {
  build(attrs: OrderAttributes): OrderDocument;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<OrderDocument | null>;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
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
orderSchema.statics.build = (attrs: OrderAttributes) => {
  return new Order({
    _id: attrs.id,
    userId: attrs.userId,
    price: attrs.price,
    status: attrs.status,
  });
};
orderSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Order.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

const Order = mongoose.model<OrderDocument, OrderModel>("Order", orderSchema);

export { Order };
