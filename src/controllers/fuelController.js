const FuelPrice = require("../models/FuelPrice");
const { SUCCESS_MESSAGES, ERROR_MESSAGES } = require("../../constants");

/**
 * Fuel Price Management - Get or Update fuel prices by state
 * POST /api/v1/fuel-price
 */
const fuelPrice = async (req, res) => {
  try {
    const { state, petrol_price, diesel_price, cng_price } = req.body;

    // Check if state is provided
    if (!state) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Check if any fuel price is provided (for update operation)
    const hasFuelPrices = petrol_price !== undefined || 
                         diesel_price !== undefined || 
                         cng_price !== undefined;

    if (hasFuelPrices) {
      // Update operation - all fuel prices must be provided
      if (petrol_price === undefined || diesel_price === undefined || cng_price === undefined) {
        return res.status(400).json({
          status: false,
          error_type: "Invalid parameter",
          message: ERROR_MESSAGES.INVALID_PARAMETER,
        });
      }

      // Validate fuel prices are valid numbers
      if (isNaN(petrol_price) || isNaN(diesel_price) || isNaN(cng_price)) {
        return res.status(400).json({
          status: false,
          error_type: "Invalid parameter",
          message: ERROR_MESSAGES.INVALID_PARAMETER,
        });
      }

      // Validate fuel prices are positive
      if (petrol_price < 0 || diesel_price < 0 || cng_price < 0) {
        return res.status(400).json({
          status: false,
          error_type: "Invalid parameter",
          message: ERROR_MESSAGES.INVALID_PARAMETER,
        });
      }

      // Update or create fuel price for the state
      const fuelData = {
        petrol_price: parseFloat(petrol_price),
        diesel_price: parseFloat(diesel_price),
        cng_price: parseFloat(cng_price),
      };

      const updatedFuelPrice = await FuelPrice.updateFuelPrice(state, fuelData);

      if (updatedFuelPrice) {
        return res.status(200).json({
          status: true,
          message: SUCCESS_MESSAGES.FUEL_PRICE_UPDATED,
        });
      } else {
        return res.status(500).json({
          status: false,
          error_type: "other",
          message: ERROR_MESSAGES.SERVER_ISSUE,
        });
      }
    } else {
      // Get operation - return fuel price for specific state or all states
      if (state.trim() === "") {
        // Return all fuel prices
        const allFuelPrices = await FuelPrice.getAllFuelPrices();
        
        if (allFuelPrices && allFuelPrices.length > 0) {
          return res.status(200).json({
            status: true,
            message: SUCCESS_MESSAGES.FUEL_PRICE_LIST_RETRIEVED,
            fuel: allFuelPrices,
          });
        } else {
          return res.status(200).json({
            status: true,
            message: SUCCESS_MESSAGES.NO_FUEL_PRICE_DATA,
            fuel: [],
          });
        }
      } else {
        // Return fuel price for specific state
        const fuelPrice = await FuelPrice.getFuelPriceByState(state);
        
        if (fuelPrice) {
          return res.status(200).json({
            status: true,
            message: SUCCESS_MESSAGES.FUEL_PRICE_RETRIEVED,
            fuel: [{
              state: fuelPrice.state,
              petrol_price: fuelPrice.petrol_price,
              diesel_price: fuelPrice.diesel_price,
              cng_price: fuelPrice.cng_price,
              last_updated: fuelPrice.last_updated.toISOString(),
            }],
          });
        } else {
          return res.status(404).json({
            status: false,
            error_type: "Invalid parameter",
            message: ERROR_MESSAGES.STATE_NOT_FOUND,
          });
        }
      }
    }
  } catch (error) {
    console.error("Fuel price error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_ISSUE,
    });
  }
};

/**
 * Get All Fuel Prices - Get all fuel prices across all states
 * GET /api/v1/fuel-price/all
 */
const getAllFuelPrices = async (req, res) => {
  try {
    const allFuelPrices = await FuelPrice.getAllFuelPrices();
    
    if (allFuelPrices && allFuelPrices.length > 0) {
      res.status(200).json({
        status: true,
        message: SUCCESS_MESSAGES.FUEL_PRICE_LIST_RETRIEVED,
        fuel: allFuelPrices,
      });
    } else {
      res.status(200).json({
        status: true,
        message: SUCCESS_MESSAGES.NO_FUEL_PRICE_DATA,
        fuel: [],
      });
    }
  } catch (error) {
    console.error("Get all fuel prices error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_ISSUE,
    });
  }
};

/**
 * Get Fuel Price by State - Get fuel price for a specific state
 * GET /api/v1/fuel-price/:state
 */
const getFuelPriceByState = async (req, res) => {
  try {
    const { state } = req.params;

    if (!state) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    const fuelPrice = await FuelPrice.getFuelPriceByState(state);
    
    if (fuelPrice) {
      res.status(200).json({
        status: true,
        message: SUCCESS_MESSAGES.FUEL_PRICE_RETRIEVED,
        fuel: [{
          state: fuelPrice.state,
          petrol_price: fuelPrice.petrol_price,
          diesel_price: fuelPrice.diesel_price,
          cng_price: fuelPrice.cng_price,
          last_updated: fuelPrice.last_updated.toISOString(),
        }],
      });
    } else {
      res.status(404).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.STATE_NOT_FOUND,
      });
    }
  } catch (error) {
    console.error("Get fuel price by state error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_ISSUE,
    });
  }
};

module.exports = {
  fuelPrice,
  getAllFuelPrices,
  getFuelPriceByState,
};
