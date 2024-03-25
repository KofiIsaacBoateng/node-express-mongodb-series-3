const express = require("express");
const path = require("path");
const notFound = require("./middleware/not-found");
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
app.use(notFound);

/*** export */
module.exports = app;
