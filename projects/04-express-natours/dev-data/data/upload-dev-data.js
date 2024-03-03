require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const MONGO_URI_LOCAL = process.env.MONGO_URI_LOCAL;
const Tours = require("../../02-natours-express-mongodb-api/models/tours");

const bulkToursData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "tours-simple.json"), "utf-8")
);

mongoose
  .connect(MONGO_URI_LOCAL)
  .then((con) => {
    console.log("database connection successful!");
  })
  .catch((error) => console.error("db connection error: ", error));

const uploadBulkData = async () => {
  try {
    const tours = await Tours.insertMany(bulkToursData);
    console.log("uploaded data successfully!");
    process.exit();
  } catch (error) {
    console.log("upload error: ", error);
  }
};

const deleteBulkData = async () => {
  try {
    const tours = await Tours.deleteMany();
    console.log("cleared data successfully!");
    process.exit();
  } catch (error) {
    console.log("upload error: ", error);
  }
};

if (process.argv[2] === "--import") {
  uploadBulkData();
} else if (process.argv[2] === "--clear") {
  deleteBulkData();
}
