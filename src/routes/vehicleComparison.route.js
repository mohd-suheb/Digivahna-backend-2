const express = require("express");
const router = express.Router();
const {
  handleValidationErrors,
  commonValidations,
} = require("../middleware/validation.js");
const {
  compareVehicles,
  getComparisonById,
  getComparisonByCarIds,
  deleteComparison,
} = require("../controllers/vehicleComparisonController.js");
const { API_ROUTES } = require("../../constants/apiRoutes.js");

// Compare Vehicles - Create comparison between 2 vehicles or get all comparisons
router.post(
  API_ROUTES.VEHICLE_COMPARISON_UPDATE.COMPARE,
  [
    // Optional validation for car IDs when provided
    commonValidations.optionalCarId("car_1"),
    commonValidations.optionalCarId("car_2"),
    handleValidationErrors,
  ],
  compareVehicles
);

// Get Comparison by ID
router.get(
  API_ROUTES.VEHICLE_COMPARISON_UPDATE.GET_COMPARISON,
  [
    commonValidations.comparisonIdParam("comparison_id"),
    handleValidationErrors,
  ],
  getComparisonById
);

// Get Comparison by Car IDs
router.get(
  API_ROUTES.VEHICLE_COMPARISON_UPDATE.GET_BY_CARS,
  [
    commonValidations.carIdParam("car_1"),
    commonValidations.carIdParam("car_2"),
    handleValidationErrors,
  ],
  getComparisonByCarIds
);

// Delete Comparison
router.delete(
  API_ROUTES.VEHICLE_COMPARISON_UPDATE.DELETE_COMPARISON,
  [
    commonValidations.comparisonIdParam("comparison_id"),
    handleValidationErrors,
  ],
  deleteComparison
);

module.exports = router;
