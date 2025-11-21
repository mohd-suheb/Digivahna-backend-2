const express = require("express");
const router = express.Router();
const { handleValidationErrors } = require("../middleware/validation.js");
const { getAllTipsList } = require("../controllers/getTipsController.js");
const { API_ROUTES } = require("../../constants/apiRoutes.js");

// Get All Vehicle Tips & Tricks - Fetch complete list of tips and tricks
router.get(
  API_ROUTES.GET_TIPS_UPDATE.GET_ALL,
  [
    // No specific validation required for this endpoint
    handleValidationErrors,
  ],
  getAllTipsList
);

module.exports = router;
