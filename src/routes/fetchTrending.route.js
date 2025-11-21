const express = require("express");
const router = express.Router();
const { handleValidationErrors } = require("../middleware/validation.js");
const {
  fetchTopTrendingVehicles,
} = require("../controllers/fetchTrendingController.js");
const { API_ROUTES } = require("../../constants/apiRoutes.js");

// Fetch Top Trending Vehicles - Get maximum 4 trending cars
router.post(
  API_ROUTES.FETCH_TRENDING_UPDATE.ADD_TO_TRENDING,
  [
    // No specific validation required for this endpoint
    handleValidationErrors,
  ],
  fetchTopTrendingVehicles
);

module.exports = router;
