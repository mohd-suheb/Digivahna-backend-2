const TrendingCars = require("../models/TrendingCars");
const { SUCCESS_MESSAGES, ERROR_MESSAGES } = require("../../constants");

/**
 * Fetch Top Trending Vehicles - Get maximum 4 trending cars
 * POST /api/add-vehicle-to-top_trending
 */
const fetchTopTrendingVehicles = async (req, res) => {
  try {
    // Get top trending cars (maximum 4)
    const cars = await TrendingCars.getTopTrendingCars(4);

    // Return success response with exact format specified
    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.TRENDING_CARS_FETCHED_SUCCESSFULLY,
      cars: cars,
    });

  } catch (error) {
    console.error("Fetch top trending vehicles error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_NOT_WORKING,
    });
  }
};

module.exports = {
  fetchTopTrendingVehicles,
};

