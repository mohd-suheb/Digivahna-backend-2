const express = require("express");
const router = express.Router();
const {
  handleValidationErrors,
  commonValidations,
} = require("../middleware/validation.js");
const {
  manageTrendingCars,
  getTrendingCarById,
} = require("../controllers/trendingCarsController.js");
const { API_ROUTES } = require("../../constants/apiRoutes.js");

// Trending Cars Management - Add, Delete, or Fetch trending cars
router.post(
  API_ROUTES.TRENDING_CARS.MANAGE,
  [commonValidations.hitType("hit_type"), handleValidationErrors],
  manageTrendingCars
);

// Get trending car by car_id
router.get(
  API_ROUTES.TRENDING_CARS.GET_BY_ID,
  [commonValidations.carIdParam("car_id"), handleValidationErrors],
  getTrendingCarById
);

module.exports = router;
