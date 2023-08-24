const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");
const xssClean = require("xss");
const rateLimit = require("express-rate-limit");
const userRouter = require("./routers/user.router");
const seedRouter = require("./routers/seed.router");
const { errorResponse } = require("./controllers/response.controller");
const authRouter = require("./routers/authRouter");
const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: "Too many requests, Please try again later",
});

app.use(morgan("dev"));
// app.use(xssClean());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);
app.use(cookieParser);

app.use("/", userRouter);
app.use("/api/v1/", seedRouter);
app.use("/api/v1/auth/", authRouter);
app.get("/", (req, res) => {
  res.send("Hello");
});

app.use((req, res, next) => {
  next(createError(404, "Route not found"));
});

app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status,
    message: err.message,
  });
});

module.exports = app;
