import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";

it("should return 401 if not authorized", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).put(`/api/tickets/${id}`).send({}).expect(401);
});

it("should return 404 if ticket id not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", signIn())
    .send({
      title: "abc",
      price: 10,
    })
    .expect(404);
});

it("should return 401 if does not own the ticket", async () => {
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", signIn())
    .send({
      title: "abc",
      price: 10,
    });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", signIn())
    .send({
      title: "abcd",
      price: 100,
    })
    .expect(401);
});

it("should return 400 if title or price is invalid", async () => {
  const cookie = signIn();
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "abc",
      price: 10,
    });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "ok",
      price: -10,
    })
    .expect(400);
});

it("should return 400 if ticket is reserved", async () => {
  const cookie = signIn();
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "abc",
      price: 10,
    });

  const ticket = await Ticket.findById(res.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "cba",
      price: 10,
    })
    .expect(400);
});

it("should successfully update with valid request", async () => {
  const cookie = signIn();
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "abc",
      price: 10,
    });

  const resUpdated = await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "abcd",
      price: 100,
    });

  expect(resUpdated.status).toEqual(200);
  expect(resUpdated.body.title).toEqual("abcd");
  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});
