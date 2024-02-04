import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { NotFoundError, currentUser, errorHandler } from "@djticketing/common";
import { createTicketRouter } from "./routes/new";
import { getTicketRouter } from "./routes/show";
import { getTicketsRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";

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
app.use(createTicketRouter);
app.use(getTicketRouter);
app.use(getTicketsRouter);
app.use(updateTicketRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
