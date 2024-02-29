require("dotenv").config();
const app = require("./app");
const mongoose = require("mongoose");
const port = process.env.PORT;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected!");
    app.listen(port, () => {
      console.log(`Server is listening on port: ${port}`);
    });
  })
  .catch((err) => console.log(err));
