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

const tourSchema = Schema({
  name: {
    type: String,
    required: [true, "Name field cannot be empty"],
    unique: [true, "Name is taken!"],
  },

  rating: {
    type: Number,
    default: 0.0,
  },
  price: {
    type: Number,
    required: [true, "Price field cannot be empty"],
  },
});

const Tour = model("Tour", tourSchema);

const testTour = new Tour({
  name: "The Fat Slayer",
  rating: 4.9,
  price: 799,
});

testTour
  .save()
  .then((doc) => console.log(doc))
  .catch((err) => console.log(err.code));
