import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@djticketing/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

jest.mock("../../stripe");

it("should return 404 if order not found", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", signIn())
    .send({
      token: "abc",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("should return 401 if user not own the order", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
  });
  await order.save();
  await request(app)
    .post("/api/payments")
    .set("Cookie", signIn())
    .send({
      token: "abc",
      orderId: order.id,
    })
    .expect(401);
});

it("should return 400 if order is cancelled", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Cancelled,
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
  });
  await order.save();
  await request(app)
    .post("/api/payments")
    .set("Cookie", signIn(order.userId))
    .send({
      token: "abc",
      orderId: order.id,
    })
    .expect(400);
});

it("should return 201 with valid inputs", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.AwaitingPayment,
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
  });
  await order.save();
  await request(app)
    .post("/api/payments")
    .set("Cookie", signIn(order.userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  expect(stripe.charges.create).toHaveBeenCalled();
  const options = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(options.amount).toEqual(10 * 100);
  expect(options.currency).toEqual("usd");

  const payment = await Payment.findOne({
    orderId: order.id,
  });
  expect(payment).not.toBeNull();
});
