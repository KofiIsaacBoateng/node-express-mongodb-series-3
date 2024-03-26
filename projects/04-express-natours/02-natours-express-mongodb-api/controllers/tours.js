// read data from ../dev-data/data/tours-simple.json
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const Tour = require("../models/tours");
const API_FEATURES = require("../utils/api-features");
const asyncWrapper = require("../utils/asyncWrapper");

/**** MAIN */
/*** Get all tours */
module.exports.getAllTours = asyncWrapper(async (req, res) => {
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
});

/*** Get tour */
module.exports.getTour = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const tour = await Tour.findById(id);

  if (!tour) {
    throw new NotFoundError(`No tour matches the id: ${id}!`);
  }

  res.status(200).json({
    success: true,
    data: tour,
  });
});

/*** Create tour */
module.exports.createTour = asyncWrapper(async (req, res) => {
  if (
    !re.body.name ||
    !req.body.price ||
    !req.body.summary ||
    !req.body.duration ||
    !req.body.maxGroupSize ||
    !req.body.difficulty ||
    !req.body.imageCover
  ) {
    throw new BadRequestError(
      "name, price, duration, summary, difficulty, maxGroupSize, and imageCover fields cannot be empty"
    );
  }
  const tour = await Tour.create(req.body);
  res.status(201).json({
    success: true,
    data: tour,
  });
});

/*** Update tour */
module.exports.updateTour = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const exists = await Tour.findById(id);
  if (!exists) {
    throw new BadRequestError(`No tour matches tour with id: ${id}`);
  }

  const tour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: tour,
  });
});

/*** Delete tour */
module.exports.deleteTour = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const exists = await Tour.findById(id);

  if (!exists) {
    throw new BadRequestError(`No tour matches tour with id: ${id}`);
  }

  await Tour.findByIdAndDelete(id);

  res.status(StatusCodes.NO_CONTENT).json({
    success: true,
    msg: "Delete success!",
  });
});

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

/*** STATISTICS */
// general starts based on difficulty levels
module.exports.getStats = asyncWrapper(async (req, res) => {
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
});

// monthly preparation stats
module.exports.monthlyPlan = asyncWrapper(async (req, res) => {
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
});
