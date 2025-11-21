const VehicleComparison = require("../models/VehicleComparison");
const TrendingCars = require("../models/TrendingCars");
const { SUCCESS_MESSAGES, ERROR_MESSAGES } = require("../../constants");

/**
 * Compare Vehicles - Create comparison between 2 vehicles or get all comparisons
 * POST /api/vehicles/compare
 */
const compareVehicles = async (req, res) => {
  try {
    const { car_1, car_2 } = req.body;

    // If no parameters provided, return all comparisons
    if (!car_1 && !car_2) {
      return await getAllComparisons(req, res);
    }

    // Validate required parameters for comparison
    if (!car_1 || !car_2) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Validate car IDs are not the same
    if (car_1 === car_2) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.SAME_CAR_COMPARISON,
      });
    }

    // Validate car IDs format
    if (typeof car_1 !== 'string' || typeof car_2 !== 'string' || 
        car_1.trim().length === 0 || car_2.trim().length === 0) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Fetch car data for both cars
    const [car1Data, car2Data] = await Promise.all([
      TrendingCars.getTrendingCarById(car_1.trim()),
      TrendingCars.getTrendingCarById(car_2.trim())
    ]);

    // Check if both cars exist
    if (!car1Data) {
      return res.status(404).json({
        status: false,
        error_type: "invalid_id",
        message: ERROR_MESSAGES.CAR_ID_DOES_NOT_EXIST.replace("car id", "car_1"),
      });
    }

    if (!car2Data) {
      return res.status(404).json({
        status: false,
        error_type: "invalid_id",
        message: ERROR_MESSAGES.CAR_ID_DOES_NOT_EXIST.replace("car id", "car_2"),
      });
    }

    // Create or update comparison
    const comparison = await VehicleComparison.createOrUpdateComparison(
      car_1.trim(),
      car_2.trim(),
      car1Data,
      car2Data
    );

    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.COMPARISON_DATA_ADDED_SUCCESSFULLY,
    });

  } catch (error) {
    console.error("Compare vehicles error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_NOT_WORKING,
    });
  }
};

/**
 * Get All Comparisons - Return all vehicle comparisons
 */
const getAllComparisons = async (req, res) => {
  try {
    const comparisons = await VehicleComparison.getAllComparisons();

    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.COMPARISONS_FETCHED_SUCCESSFULLY,
      data: {
        comparisons: comparisons,
        total_count: comparisons.length,
      },
    });

  } catch (error) {
    console.error("Get all comparisons error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_NOT_WORKING,
    });
  }
};

/**
 * Get Comparison by ID - Get specific comparison by comparison_id
 * GET /api/vehicles/compare/:comparison_id
 */
const getComparisonById = async (req, res) => {
  try {
    const { comparison_id } = req.params;

    // Validate comparison_id parameter
    if (!comparison_id) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Get comparison by comparison_id
    const comparison = await VehicleComparison.getComparisonById(comparison_id);
    if (!comparison) {
      return res.status(404).json({
        status: false,
        error_type: "invalid_id",
        message: ERROR_MESSAGES.COMPARISON_ID_DOES_NOT_EXIST,
      });
    }

    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.COMPARISON_FETCHED_SUCCESSFULLY,
      data: {
        comparison: comparison,
      },
    });

  } catch (error) {
    console.error("Get comparison by ID error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_NOT_WORKING,
    });
  }
};

/**
 * Get Comparison by Car IDs - Get comparison between specific cars
 * GET /api/vehicles/compare/cars/:car_1/:car_2
 */
const getComparisonByCarIds = async (req, res) => {
  try {
    const { car_1, car_2 } = req.params;

    // Validate car IDs
    if (!car_1 || !car_2) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Get comparison by car IDs
    const comparison = await VehicleComparison.getComparisonByCarIds(car_1, car_2);
    if (!comparison) {
      return res.status(404).json({
        status: false,
        error_type: "invalid_id",
        message: ERROR_MESSAGES.COMPARISON_NOT_FOUND,
      });
    }

    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.COMPARISON_FETCHED_SUCCESSFULLY,
      data: {
        comparison: comparison,
      },
    });

  } catch (error) {
    console.error("Get comparison by car IDs error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_NOT_WORKING,
    });
  }
};

/**
 * Delete Comparison - Delete a comparison by comparison_id
 * DELETE /api/vehicles/compare/:comparison_id
 */
const deleteComparison = async (req, res) => {
  try {
    const { comparison_id } = req.params;

    // Validate comparison_id parameter
    if (!comparison_id) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Delete comparison
    const deletedComparison = await VehicleComparison.deleteComparison(comparison_id);
    if (!deletedComparison) {
      return res.status(404).json({
        status: false,
        error_type: "invalid_id",
        message: ERROR_MESSAGES.COMPARISON_ID_DOES_NOT_EXIST,
      });
    }

    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.COMPARISON_DELETED_SUCCESSFULLY,
    });

  } catch (error) {
    console.error("Delete comparison error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_NOT_WORKING,
    });
  }
};

module.exports = {
  compareVehicles,
  getComparisonById,
  getComparisonByCarIds,
  deleteComparison,
};

