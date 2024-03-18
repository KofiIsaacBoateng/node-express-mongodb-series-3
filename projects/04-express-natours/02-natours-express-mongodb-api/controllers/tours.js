// read data from ../dev-data/data/tours-simple.json
const path = require("path");
const Tour = require("../models/tours");

// get all tours
module.exports.getAllTours = async (req, res) => {
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
      msg: error.errmsg,
    });
  }
};

// get tour
module.exports.getTour = (req, res) => {
  const { id } = req.params;

  try {
    const tour = Tour.findById(id);

    res.status(200).json({
      success: true,
      data: tour,
    });
  } catch (error) {}
  res.status(200).json({
    success: true,
    // data: tour
  });
};

// create tour
module.exports.createTour = async (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({
      success: false,
      msg: `name and price of tour cannot be undefined!`,
    });
  }

  try {
    const tour = await Tour.create(req.body);

    res.status(201).json({
      success: true,
      data: tour,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: error.errmsg,
    });
  }
};

// update a tour
module.exports.updateTour = async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      msg: `name and price of tour cannot be undefined!`,
    });
  }
};

module.exports.deleteTour = (req, res) => {
  const { id } = req.params;

  res.status(201).json({
    success: true,
    data: newTour,
  });
};
