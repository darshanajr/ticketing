import request from "supertest";
import { Ticket } from "../../models/ticket";
import app from "../../app";
import mongoose from "mongoose";

it("should return orders belongs to user", async () => {
  const ticket1 = await saveTicket();
  const ticket2 = await saveTicket();
  await saveTicket();

  const userToken = signIn();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", userToken)
    .send({
      ticketId: ticket1.id,
    })
    .expect(201);

  // some other user
  await request(app)
    .post("/api/orders")
    .set("Cookie", signIn())
    .send({
      ticketId: ticket2.id,
    })
    .expect(201);

  const res = await request(app).get("/api/orders").set("Cookie", userToken);

  expect(res.status).toEqual(200);
  expect(res.body.length).toEqual(1);
  expect(res.body[0].id).toEqual(order.id);
  expect(res.body[0].ticket.id).toEqual(ticket1.id);
});

async function saveTicket() {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test",
    price: 20,
  });
  await ticket.save();

  return ticket;
}
