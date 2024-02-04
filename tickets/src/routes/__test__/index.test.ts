import request from "supertest";
import app from "../../app";

it("should fetch existing tickets", async () => {
  await request(app).post("/api/tickets").set("Cookie", signIn()).send({
    title: "abc",
    price: 10,
  });

  const res = await request(app).get("/api/tickets").send();

  expect(res.status).toEqual(200);
  expect(res.body.length).toEqual(1);
});
