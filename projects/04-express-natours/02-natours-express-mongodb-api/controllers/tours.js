// read data from ../dev-data/data/tours-simple.json
const Tour = require("../models/tours");
const API_FEATURES = require("../utils/api-features");

/*** STATISTICS */
// general starts based on difficulty levels
module.exports.getStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: {
          ratingsAverage: { $gte: 4.3 },
        },
      },
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          numberOfTours: { $sum: 1 },
          numberOfRatings: { $sum: "$ratingsQuantity" },
          averageRating: { $avg: "$ratingsAverage" },
          averagePrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },

      {
        $sort: { averageRating: -1 },
      },

      // {
      //   $match: {
      //     _id: { $ne: "EASY" },
      //   },
      // },
    ]);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: error,
    });
  }
};

// monthly preparation stats
module.exports.monthlyPlan = async (req, res) => {
  try {
    const { year } = req.params; // 2021
    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },

      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },

      {
        $group: {
          _id: { $month: "$startDates" },
          numOfTours: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        $sort: { numOfTours: -1 },
      },
      {
        $addFields: {
          month: "$_id",
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      results: plan.length,
      data: plan,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: error,
    });
  }
};

/**** MAIN */
/*** Get all tours */
module.exports.getAllTours = async (req, res) => {
  try {
    let features = new API_FEATURES(Tour.find(), req.query)
      .filter()
      .sort()
      .limitingFields()
      .pagination();

    const tours = await features.query;

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

/*** Get tour */
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

/*** Create tour */
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

/*** Update tour */
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
      err: error,
    });
  }
};

/*** Delete tour */
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
