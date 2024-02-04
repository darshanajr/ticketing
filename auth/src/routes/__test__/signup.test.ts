import request from "supertest";
import app from "../../app";

it("returns a 201 on successful signup", () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@email.com",
      password: "password",
    })
    .expect(201);
});

it("returns a 400 when invalid email provided in signup", () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test.com",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 when invalid password provided in signup", () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@email.com",
      password: "p",
    })
    .expect(400);
});

it("returns a 400 when same email used in multiple signup", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@email.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@email.com",
      password: "password",
    })
    .expect(400);
});

it("sets a cookie on successful signup", async () => {
  const res = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@email.com",
      password: "password",
    })
    .expect(201);

  expect(res.get("Set-Cookie")).toBeDefined();
});
