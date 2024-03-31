/**
 * require("express-async-errors");
 * takes care of all catch(next) and pushes errors to the errorHandler
 * should replace asyncWrapper if you want it to
 *  */
const express = require("express");
const path = require("path");
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");
const app = express();
const { rateLimit } = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const helmet = require("helmet");

/***  */
// routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const tourRoutes = require("./routes/tours");

/** GLOBAL MIDDLEWARE */

/**** limit number of request from the same api */
const limiter = rateLimit({
  limit: 100,
  windowMs: 60 * 60 * 1000,
});
app.use("/api", limiter);

/**** set security http headers  */
app.use(helmet());

/*** Body parser, reading body into req.body */
app.use(express.json({ limit: "10kb" }));

/*** Data sanitization against NoSQL query injection */
app.use(mongoSanitize());

/*** Data sanitization against XSS */
app.use(xss());

/*** Prevent parameter pollution */
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

/*** serve static files */
app.use(express.static(path.join(__dirname, "..", "public")));

/*** routes */
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/auth", authRoutes);

/**** final middleware */
app.use(errorHandler); // error handler
app.use(notFound); // route not found

/*** export */
module.exports = app;
