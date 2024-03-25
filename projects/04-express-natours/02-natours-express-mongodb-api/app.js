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

// routes
const userRoutes = require("./routes/users");
const tourRoutes = require("./routes/tours");

/** middlewares */
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

/*** routes */
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tours", tourRoutes);

/**** final middleware */
app.use(errorHandler);
app.use(notFound);

/*** export */
module.exports = app;
