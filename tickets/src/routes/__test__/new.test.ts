import request from "supertest";
import app from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("should be authenticated to create a new ticket", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("should create ticket with valid inputs", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", signIn())
    .send({
      title: "abc",
      price: 10,
    });

  expect(res.status).toEqual(201);
  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("should return 400 when title invalid", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signIn())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signIn())
    .send({
      price: 10,
    })
    .expect(400);
});

it("should return 400 when price invalid", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signIn())
    .send({
      title: "abc",
      price: -10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signIn())
    .send({
      title: "abc",
    })
    .expect(400);
});
