const express = require("express");
const router = express.Router();
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  top5,
  getTop5Rated,
  getTop5Cheapest,
  getTop5Expensive,
  getStats,
} = require("../controllers/tours");

/*** ALIASES */
router.get("/top-5-rated", top5, getTop5Rated, getAllTours);
router.get("/top-5-cheapest", top5, getTop5Cheapest, getAllTours);
router.get("/top-5-expensive", top5, getTop5Expensive, getAllTours);

/*** STATISTICS */
router.route("/get-stats", getStats);

/*** MAIN ROUTES */
router.route("/").get(getAllTours).post(createTour);

router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
