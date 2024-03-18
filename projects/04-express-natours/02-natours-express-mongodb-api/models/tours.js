const { model, Schema, Types } = require("mongoose");

const tourSchema = new Schema({
  _id: Types.ObjectId,
  name: {
    type: String,
    required: [true, "Name field cannot be empty"],
    unique: [true, "Name is taken!"],
  },
  duration: {
    type: String,
    required: [true, "Please specify the tour duration"],
  },

  maxGroupSize: {
    type: Number,
    required: [
      true,
      "Must specify the maximum number of people that can be in attendance",
    ],
  },

  difficulty: {
    type: String,
    required: [true, "Please state the level of difficulty"],
  },

  ratingsQuantity: {
    type: Number,
    default: 0,
  },

  ratingsAverage: {
    type: Number,
    default: 4.5,
  },

  price: {
    type: Number,
    required: [true, "Price field cannot be empty"],
  },

  priceDiscount: Number,

  description: {
    type: String,
    trim: true,
  },

  summary: {
    type: String,
    trim: true,
    required: [true, "Summary can't be missing"],
  },

  imageCover: {
    type: String,
    required: [true, "cover image is missing"],
  },

  images: [String],

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  startDates: [Date],
});

module.exports = model("Tour", tourSchema);
