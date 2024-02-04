import request from "supertest";
import app from "../../app";

it("should clear cookie in successful sign-out", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@email.com",
      password: "password",
    })
    .expect(201);

  const res = await request(app)
    .post("/api/users/sign-out")
    .send({})
    .expect(200);

  expect(res.get("Set-Cookie")).toBeDefined();
});
