import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";

it("should return 404 if order not found", async () => {
  await request(app)
    .get(`/api/orders/${new mongoose.Types.ObjectId()}`)
    .set("Cookie", signIn())
    .send()
    .expect(404);
});

it("should return 401 if user not authorized to access order", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test",
    price: 10,
  });
  await ticket.save();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", signIn())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", signIn())
    .send()
    .expect(401);
});

it("should return order belongs to user", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test",
    price: 10,
  });
  await ticket.save();

  const token = signIn();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", token)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  const res = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", token)
    .send();

  expect(res.status).toEqual(200);
  expect(res.body.id).toEqual(order.id);
});
