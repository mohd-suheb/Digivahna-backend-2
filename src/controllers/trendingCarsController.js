const TrendingCars = require("../models/TrendingCars");
const { SUCCESS_MESSAGES, ERROR_MESSAGES } = require("../../constants");

/**
 * Trending Cars Management - Add, Delete, or Fetch trending cars
 * POST /api/user/trending-cars
 */
const manageTrendingCars = async (req, res) => {
  try {
    const { hit_type, car_id, ...carData } = req.body;

    // Validate hit_type parameter
    if (!hit_type) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Handle different hit_type operations
    switch (hit_type.toLowerCase()) {
      case "add":
        return await addTrendingCar(req, res, carData);
      
      case "delete":
        return await deleteTrendingCar(req, res, car_id);
      
      case "fetch":
        return await fetchTrendingCars(req, res);
      
      default:
        return res.status(400).json({
          status: false,
          error_type: "Invalid parameter",
          message: ERROR_MESSAGES.INVALID_HIT_TYPE,
        });
    }
  } catch (error) {
    console.error("Trending cars management error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_NOT_WORKING,
    });
  }
};

/**
 * Add a new trending car
 */
const addTrendingCar = async (req, res, carData) => {
  try {
    // Validate required fields for adding a car
    const requiredFields = [
      "brand_name",
      "model_name", 
      "type",
      "price",
      "price_display",
      "mileage",
      "top_speed",
      "image_url",
      "specifications",
      "detailed_specifications",
      "dimensions",
      "features"
    ];

    // Check if all required fields are present
    const missingFields = requiredFields.filter(field => !carData[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Validate nested objects
    const requiredSpecFields = ["engine_capacity", "transmission", "fuel_tank_capacity", "seat_height", "kerb_weight"];
    const requiredDetailedSpecFields = ["max_power", "max_torque", "riding_mode", "gear_shifting_pattern"];
    const requiredDimensionFields = ["bootspace", "ground_clearance", "length", "width", "height"];
    const requiredFeatureFields = ["air_conditioner", "central_locking", "power_windows", "headrest", "parking_assist", "cruise_control", "music_system_count", "apple_carplay", "android_auto", "abs", "sunroof", "third_row_ac", "airbags"];

    const missingSpecFields = requiredSpecFields.filter(field => !carData.specifications[field]);
    const missingDetailedSpecFields = requiredDetailedSpecFields.filter(field => !carData.detailed_specifications[field]);
    const missingDimensionFields = requiredDimensionFields.filter(field => !carData.dimensions[field]);
    const missingFeatureFields = requiredFeatureFields.filter(field => carData.features[field] === undefined);

    if (missingSpecFields.length > 0 || missingDetailedSpecFields.length > 0 || 
        missingDimensionFields.length > 0 || missingFeatureFields.length > 0) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Validate price is a positive number
    if (typeof carData.price !== 'number' || carData.price <= 0) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Validate music_system_count is a positive number
    if (typeof carData.features.music_system_count !== 'number' || carData.features.music_system_count < 0) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Validate airbags is an array with at least one element
    if (!Array.isArray(carData.features.airbags) || carData.features.airbags.length === 0) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Add the trending car
    const newCar = await TrendingCars.addTrendingCar(carData);

    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.TRENDING_CARS_ADDED_SUCCESSFULLY,
    });

  } catch (error) {
    console.error("Add trending car error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_NOT_WORKING,
    });
  }
};

/**
 * Delete a trending car by car_id
 */
const deleteTrendingCar = async (req, res, carId) => {
  try {
    // Validate car_id parameter
    if (!carId) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Check if car exists
    const existingCar = await TrendingCars.getTrendingCarById(carId);
    if (!existingCar) {
      return res.status(404).json({
        status: false,
        error_type: "invalid_id",
        message: ERROR_MESSAGES.CAR_ID_DOES_NOT_EXIST,
      });
    }

    // Delete the car
    const deletedCar = await TrendingCars.deleteTrendingCar(carId);
    if (!deletedCar) {
      return res.status(404).json({
        status: false,
        error_type: "invalid_id",
        message: ERROR_MESSAGES.CAR_ID_DOES_NOT_EXIST,
      });
    }

    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.TRENDING_CARS_DELETED_SUCCESSFULLY,
    });

  } catch (error) {
    console.error("Delete trending car error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_NOT_WORKING,
    });
  }
};

/**
 * Fetch all trending cars
 */
const fetchTrendingCars = async (req, res) => {
  try {
    // Get all trending cars
    const cars = await TrendingCars.getAllTrendingCars();

    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.TRENDING_CARS_FETCHED_SUCCESSFULLY,
      data: {
        cars: cars,
        total_count: cars.length,
      },
    });

  } catch (error) {
    console.error("Fetch trending cars error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_NOT_WORKING,
    });
  }
};

/**
 * Get trending car by car_id
 * GET /api/user/trending-cars/:car_id
 */
const getTrendingCarById = async (req, res) => {
  try {
    const { car_id } = req.params;

    // Validate car_id parameter
    if (!car_id) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Get car by car_id
    const car = await TrendingCars.getTrendingCarById(car_id);
    if (!car) {
      return res.status(404).json({
        status: false,
        error_type: "invalid_id",
        message: ERROR_MESSAGES.CAR_ID_DOES_NOT_EXIST,
      });
    }

    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.TRENDING_CAR_FETCHED_SUCCESSFULLY,
      data: {
        car: car,
      },
    });

  } catch (error) {
    console.error("Get trending car by ID error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_NOT_WORKING,
    });
  }
};

module.exports = {
  manageTrendingCars,
  getTrendingCarById,
};

