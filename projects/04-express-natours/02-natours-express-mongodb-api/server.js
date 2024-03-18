require("dotenv").config();
const app = require("./app");
const { connect, Schema, model } = require("mongoose");
const port = process.env.PORT;

connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected!");
    app.listen(port, () => {
      console.log(`Server is listening on port: ${port}`);
    });
  })
  .catch((err) => console.log(err));
