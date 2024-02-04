import mongoose from "mongoose";
import app from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY env must be configured");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI env must be configured");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000");
  });
};

start();
