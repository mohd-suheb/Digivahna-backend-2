const express = require("express");
const router = express.Router();
const {
  handleValidationErrors,
  commonValidations,
} = require("../middleware/validation.js");
const {
  manageTipsTricks,
  getAllTips,
  getTipById,
  deleteTip,
} = require("../controllers/tipsTricksController.js");
const { API_ROUTES } = require("../../constants/apiRoutes.js");

// Manage Tips and Tricks - Add new tip or update existing tip
router.post(
  API_ROUTES.TIPS_TRICKS_UPDATE.MANAGE,
  [
    // Optional validation for tip_id when provided
    commonValidations.optionalTipId("tip_id"),
    handleValidationErrors,
  ],
  manageTipsTricks
);

// Get All Tips and Tricks
router.get(
  API_ROUTES.TIPS_TRICKS_UPDATE.GET_ALL,
  [
    // No specific validation required for this endpoint
    handleValidationErrors,
  ],
  getAllTips
);

// Get Tip by ID
router.get(
  API_ROUTES.TIPS_TRICKS_UPDATE.GET_BY_ID,
  [commonValidations.tipIdParam("tip_id"), handleValidationErrors],
  getTipById
);

// Delete Tip
router.delete(
  API_ROUTES.TIPS_TRICKS_UPDATE.DELETE,
  [commonValidations.tipIdParam("tip_id"), handleValidationErrors],
  deleteTip
);

module.exports = router;
