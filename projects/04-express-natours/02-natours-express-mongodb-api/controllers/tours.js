// read data from ../dev-data/data/tours-simple.json
const Tour = require("../models/tours");

/*** ALIASES */

module.exports.top5 = (req, res, next) => {
  // top 5
  req.query.limit = 5;
  req.query.fields = "name,price,ratingsAverage,ratingsQuantity,summary";
  next();
};

module.exports.getTop5Rated = (req, res, next) => {
  // top 5 ratings
  req.query.sort = "-ratingsAverage,-ratingsQuantity";
  next();
};

module.exports.getTop5Cheapest = (req, res, next) => {
  // top 5 cheapest
  req.query.sort = "price,-ratingsAverage,-ratingsQuantity";
  next();
};

module.exports.getTop5Expensive = (req, res, next) => {
  // top 5 expensive
  req.query.sort = "-price,-ratingsAverage,-ratingsQuantity";
  next();
};

/*** GET ALL TOURS */
module.exports.getAllTours = async (req, res) => {
  try {
    const queryObject = { ...req.query };
    const eQueryFields = ["page", "limit", "sort", "fields"];
    eQueryFields.forEach((query) => delete queryObject[query]);

    /** FILTERING */
    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(
      /\b(gt|lt|gte|lte|eq|ne)\b/g,
      (match) => `$${match}`
    );

    const restoredQuery = JSON.parse(queryString, (key, value) => {
      const isTypeNumber =
        key === "ratingsAverage" ||
        key === "ratingsQuantity" ||
        key === "price" ||
        key === "priceDiscount";
      if (isTypeNumber && typeof value !== "object") return Number(value);
      else if (isTypeNumber && typeof value === "object") {
        const keys = Object.keys(value);
        return { [keys[0]]: Number(value[keys[0]]) };
      } else return value;
    });

    let query = Tour.find(restoredQuery);

    /** SORTING */
    if (req.query.sort) {
      const sortQuery = req.query.sort;
      query = query.sort(sortQuery.split(",").join(" "));
    } else {
      query = query.sort("-createdAt");
    }

    /*** LIMITING FIELDS */
    if (req.query.fields) {
      const fieldsQuery = req.query.fields;
      query = query.select(fieldsQuery.split(",").join(" "));
    } else {
      query = query.select("-__v");
    }

    /*** PAGINATION */
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;

    /**NB::==> make sure to update error handling */
    query = query.limit(limit).skip(skip);
    const tours = await query;

    res.status(200).json({
      success: true,
      results: tours.length,
      data: tours,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: error,
    });
  }
};

// get tour
module.exports.getTour = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id);

    if (!tour) {
      res.status(404).json({
        success: false,
        msg: "Tour not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: tour,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error,
    });
  }
};

// create tour
module.exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json({
      success: true,
      data: tour,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: error,
    });
  }
};

// update a tour
module.exports.updateTour = async (req, res) => {
  try {
    const { id } = req.params;

    const exists = await Tour.findById(id);
    if (!exists) {
      res.status(404).json({
        success: false,
        msg: "Tour not found!",
      });
    }

    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: tour,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      err: err,
    });
  }
};

module.exports.deleteTour = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id);

    if (!tour) {
      res.status(404).json({
        success: false,
        msg: "Tour don't even exist!",
      });
    }

    await Tour.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      msg: "Delete success!",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: error,
    });
  }
};
