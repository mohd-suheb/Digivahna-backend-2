const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const { handleValidationErrors } = require("../middleware/validation");
const {
  verifyAccessCode,
  generateAccessCode,
  getAccessCodeStatus,
  cancelAccessCode,
  cleanupExpiredAccessCodes,
} = require("../controllers/accessCodeController");
const { API_ROUTES } = require("../../constants/apiRoutes.js");

/**
 * Access Code Routes
 * Handles document access code verification and management
 */

/**
 * @route   POST /verify-access-document
 * @desc    Verify access code for document access
 * @access  Public (No authentication required as per requirements)
 */
router.post(
  API_ROUTES.ACCESS_CODE.VERIFY,
  [
    body("user_id")
      .notEmpty()
      .withMessage("User ID is required")
      .isLength({ min: 1, max: 100 })
      .withMessage("User ID must be between 1 and 100 characters")
      .custom((value) => {
        // Check if it's a valid email or phone number
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;

        if (!emailRegex.test(value) && !phoneRegex.test(value)) {
          throw new Error("User ID must be a valid email or phone number");
        }
        return true;
      }),
    body("vehicle_id")
      .notEmpty()
      .withMessage("Vehicle ID is required")
      .isLength({ min: 1, max: 100 })
      .withMessage("Vehicle ID must be between 1 and 100 characters")
      .matches(/^[A-Za-z0-9_-]+$/)
      .withMessage(
        "Vehicle ID must contain only alphanumeric characters, hyphens, and underscores"
      ),
  ],
  handleValidationErrors,
  verifyAccessCode
);

/**
 * @route   POST /verify-access-document/generate
 * @desc    Generate access code for document sharing
 * @access  Public
 */
router.post(
  API_ROUTES.ACCESS_CODE.GENERATE,
  [
    body("user_id")
      .notEmpty()
      .withMessage("User ID is required")
      .isLength({ min: 1, max: 100 })
      .withMessage("User ID must be between 1 and 100 characters")
      .custom((value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;

        if (!emailRegex.test(value) && !phoneRegex.test(value)) {
          throw new Error("User ID must be a valid email or phone number");
        }
        return true;
      }),
    body("vehicle_id")
      .notEmpty()
      .withMessage("Vehicle ID is required")
      .isLength({ min: 1, max: 100 })
      .withMessage("Vehicle ID must be between 1 and 100 characters")
      .matches(/^[A-Za-z0-9_-]+$/)
      .withMessage(
        "Vehicle ID must contain only alphanumeric characters, hyphens, and underscores"
      ),
    body("max_access_count")
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage("Max access count must be between 1 and 10"),
  ],
  handleValidationErrors,
  generateAccessCode
);

/**
 * @route   GET /verify-access-document/:user_id/:vehicle_id/status
 * @desc    Get access code status
 * @access  Public
 */
router.get(
  API_ROUTES.ACCESS_CODE.GET_STATUS,
  [
    param("user_id")
      .notEmpty()
      .withMessage("User ID is required")
      .isLength({ min: 1, max: 100 })
      .withMessage("User ID must be between 1 and 100 characters")
      .custom((value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;

        if (!emailRegex.test(value) && !phoneRegex.test(value)) {
          throw new Error("User ID must be a valid email or phone number");
        }
        return true;
      }),
    param("vehicle_id")
      .notEmpty()
      .withMessage("Vehicle ID is required")
      .isLength({ min: 1, max: 100 })
      .withMessage("Vehicle ID must be between 1 and 100 characters")
      .matches(/^[A-Za-z0-9_-]+$/)
      .withMessage(
        "Vehicle ID must contain only alphanumeric characters, hyphens, and underscores"
      ),
  ],
  handleValidationErrors,
  getAccessCodeStatus
);

/**
 * @route   POST /verify-access-document/cancel
 * @desc    Cancel access code
 * @access  Public
 */
router.post(
  API_ROUTES.ACCESS_CODE.CANCEL,
  [
    body("user_id")
      .notEmpty()
      .withMessage("User ID is required")
      .isLength({ min: 1, max: 100 })
      .withMessage("User ID must be between 1 and 100 characters")
      .custom((value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;

        if (!emailRegex.test(value) && !phoneRegex.test(value)) {
          throw new Error("User ID must be a valid email or phone number");
        }
        return true;
      }),
    body("vehicle_id")
      .notEmpty()
      .withMessage("Vehicle ID is required")
      .isLength({ min: 1, max: 100 })
      .withMessage("Vehicle ID must be between 1 and 100 characters")
      .matches(/^[A-Za-z0-9_-]+$/)
      .withMessage(
        "Vehicle ID must contain only alphanumeric characters, hyphens, and underscores"
      ),
  ],
  handleValidationErrors,
  cancelAccessCode
);

/**
 * @route   POST /verify-access-document/cleanup-expired
 * @desc    Cleanup expired access codes
 * @access  Public
 */
router.post(API_ROUTES.ACCESS_CODE.CLEANUP, cleanupExpiredAccessCodes);

module.exports = router;
