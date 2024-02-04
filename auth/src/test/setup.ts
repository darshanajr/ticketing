import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../app";

declare global {
  var signIn: () => Promise<string[]>;
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "jwt-key";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  collections.forEach(async (collection) => await collection.deleteMany({}));
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

signIn = async () => {
  const res = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@email.com",
      password: "password",
    })
    .expect(201);

  return res.get("Set-Cookie");
};
