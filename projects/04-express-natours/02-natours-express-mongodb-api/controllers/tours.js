// read data from ../dev-data/data/tours-simple.json
const Tour = require("../models/tours");

// get all tours
module.exports.getAllTours = async (req, res) => {
  const queryObject = req.query;
  console.log(queryObject);
  try {
    const tours = await Tour.find();

    res.status(200).json({
      success: true,
      results: tours.length,
      data: tours,
    });
  } catch (error) {
    res.status(404).json({
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
