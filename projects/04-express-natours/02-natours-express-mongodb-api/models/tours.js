const { model, Schema, Types } = require("mongoose");
const slugify = require("slugify");
// const validator = require("validator"); /*** third party validator */

const tourSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name field cannot be empty"],
      trim: true,
      unique: true,
      minLength: [3, "Tour name must be at least 3 characters"],
      maxLength: [50, "Tour name must not exceed 50 characters"],
      // validate: [validator.isAlpha, "must contain alphabets only"], /** third party validator */
    },

    tourSlug: String,

    isSecretTour: {
      type: Boolean,
      default: false,
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
      required: [true, "Difficulty level is required!"],
      enum: {
        values: ["medium", "easy", "difficult"],
        message: "Difficulty: [{VALUE}] isn't supported",
      },
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be from 1 to 5"],
      max: [5, "Rating mush be from 1 to 5"],
    },

    price: {
      type: Number,
      required: [true, "Price field cannot be empty"],
    },

    priceDiscount: {
      type: Number,
      default: 0,
      validate: {
        // validator will not work on any update method
        validator: function (value) {
          return value <= this.price;
        },

        message: "price discount must always be less than the product price",
      },
    },

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

    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

/*** VIRTUAL PROPERTIES */
tourSchema.virtual("durationWeek").get(function () {
  // virtual values cannot be involved in a query
  return this.duration / 7;
});

/***
 * DOCUMENT MIDDLEWARE
 *
 * Only works for creating and/or saving new documents
 * Doesn't apply to queries or aggregations
 *
 */
tourSchema.pre("save", function (next) {
  this.tourSlug = slugify(this.name, { lower: true });
  next();
});

tourSchema.post("save", function (docs, next) {
  console.log("Tour slug created!\nOutput is: ", docs.tourSlug);
  next();
});

/***
 * QUERY MIDDLEWARE
 *
 * works on query methods and a few addition
 *
 */
tourSchema.pre(/^find/, function (next) {
  this.find({
    isSecretTour: {
      $ne: true,
    },
  });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log("The query took: ", (Date.now() - this.start) / 1000, " seconds");
  next();
});

/***
 * AGGREGATION MIDDLEWARE
 *
 * works on aggregation
 */
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({
    $match: {
      isSecretTour: {
        $ne: true,
      },
    },
  });
  this.start = Date.now();
  next();
});

tourSchema.post("aggregate", function (docs, next) {
  console.log(
    "Aggregation took: ",
    (Date.now() - this.start) / 1000,
    " seconds"
  );
  next();
});

module.exports = model("Tour", tourSchema);
