import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { NotFoundError, currentUser, errorHandler } from "@djticketing/common";
import { createOrderRouter } from "./routes/new";
import { getOrderRouter } from "./routes/show";
import { getOrdersRouter } from "./routes";
import { cancelOrdersRouter } from "./routes/cancel";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);
app.use(createOrderRouter);
app.use(getOrderRouter);
app.use(getOrdersRouter);
app.use(cancelOrdersRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
