import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";

it("should return 404 if ticket does not exists", async () => {
  await request(app)
    .post("/api/orders")
    .set("Cookie", signIn())
    .send({
      ticketId: new mongoose.Types.ObjectId(),
    })
    .expect(404);
});

it("should return 400 if ticket is already reserved", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test",
    price: 10,
  });
  await ticket.save();

  const order = Order.build({
    userId: "test",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signIn())
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it("should reserve a ticket if available", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test",
    price: 10,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signIn())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
