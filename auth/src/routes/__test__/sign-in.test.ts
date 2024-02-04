import request from "supertest";
import app from "../../app";

it("returns a 400 when invalid email provided in sign-in", () => {
  return request(app)
    .post("/api/users/sign-in")
    .send({
      email: "test.com",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 when invalid password empty in sign-in", () => {
  return request(app)
    .post("/api/users/sign-in")
    .send({
      email: "test@email.com",
      password: "",
    })
    .expect(400);
});

it("return a 400 when email does not exists in sign-in", () => {
  return request(app)
    .post("/api/users/sign-in")
    .send({
      email: "not.exists@email.com",
      password: "password",
    })
    .expect(400);
});

it("return a 400 when password is wrong in sign-in", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@email.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users/sign-in")
    .send({
      email: "test@email.com",
      password: "wrongPassword",
    })
    .expect(400);
});

it("should set a cookie in successful sign-in", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@email.com",
      password: "password",
    })
    .expect(201);

  const res = await request(app)
    .post("/api/users/sign-in")
    .send({
      email: "test@email.com",
      password: "password",
    })
    .expect(200);

  expect(res.get("Set-Cookie")).toBeDefined();
});
