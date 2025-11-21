const express = require("express");
const router = express.Router();
const {
  handleValidationErrors,
  commonValidations,
} = require("../middleware/validation.js");
const {
  fuelPrice,
  getAllFuelPrices,
  getFuelPriceByState,
} = require("../controllers/fuelController.js");
const { API_ROUTES } = require("../../constants/apiRoutes.js");

// Fuel Price Management - Get or Update fuel prices by state
router.post(
  API_ROUTES.FUEL.FUEL_PRICE,
  [
    commonValidations.fuelState("state"),
    commonValidations.fuelPetrolPrice("petrol_price"),
    commonValidations.fuelDieselPrice("diesel_price"),
    commonValidations.fuelCngPrice("cng_price"),
    handleValidationErrors,
  ],
  fuelPrice
);

// Get All Fuel Prices - Get all fuel prices across all states
router.get(API_ROUTES.FUEL.ALL_FUEL_PRICES, getAllFuelPrices);

// Get Fuel Price by State - Get fuel price for a specific state
router.get(
  API_ROUTES.FUEL.FUEL_PRICE_BY_STATE,
  [commonValidations.fuelStateParam("state"), handleValidationErrors],
  getFuelPriceByState
);

module.exports = router;
