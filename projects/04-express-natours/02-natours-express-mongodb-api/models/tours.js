const { model, Schema, Types } = require("mongoose");

const tourSchema = new Schema({
  _id: Types.ObjectId,

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

module.exports = model("Tour", tourSchema);
