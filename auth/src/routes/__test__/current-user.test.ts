import request from "supertest";
import app from "../../app";

it("should return user detail in successful request", async () => {
  const cookie = await signIn();

  const res = await request(app)
    .get("/api/users/current-user")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(res.body.currentUser.email).toEqual("test@email.com");
});

it("should return null when unauthenticated", async () => {
  const res = await request(app)
    .get("/api/users/current-user")
    .send()
    .expect(200);

  expect(res.body.currentUser).toBeNull();
});
