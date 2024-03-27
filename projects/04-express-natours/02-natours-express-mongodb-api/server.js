require("dotenv").config();
const app = require("./app");
const { connect, Schema, model } = require("mongoose");
const PORT = process.env.PORT || 3500;

/*** uncaught exceptions */
process.on("uncaughtException", (error) => {
  console.log("UNCAUGHT EXCEPTIONS: Shutting down server...");
  console.log(error.name, ": ", error.message);
  process.exit(1);
});

let server;

connect(process.env.MONGO_URI_LOCAL).then((data) =>
  console.log("Database connection successful!")
);
server = app.listen(PORT, () =>
  console.log(`Server is listening on PORT: ${PORT}`)
);

/*** unhandled rejections - like database connection failure */
process.on("unhandledRejection", (error) => {
  console.log("UNHANDLED REJECTION: Shutting down server...");
  console.log(error.name, ": ", error.message);
  server.close(() => process.exit(1));
});
