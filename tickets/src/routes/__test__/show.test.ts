import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";

it("should return 404 if ticket not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("should return the ticket if it exist", async () => {
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", signIn())
    .send({
      title: "abc",
      price: 10,
    });

  await request(app).get(`/api/tickets/${res.body.id}`).send().expect(200);
});
