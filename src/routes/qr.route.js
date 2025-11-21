const express = require("express");
const router = express.Router();
const {
  handleValidationErrors,
  commonValidations,
} = require("../middleware/validation.js");
const {
  generateQRCode,
  getQRCodeDetails,
  validateQRCode,
  assignQRToVehicle,
  getQRAssignmentDetails,
  getVehicleQRAssignment,
} = require("../controllers/qrController.js");
const { API_ROUTES } = require("../../constants/apiRoutes.js");

// Generate QR Code - Generate QR codes based on provided parameters
router.post(
  API_ROUTES.QR.GENERATE_QR,
  [
    commonValidations.qrGenererId("generer_id"),
    commonValidations.qrUnit("qr_unit"),
    commonValidations.qrGeneratedBy("genreated_by"),
    handleValidationErrors,
  ],
  generateQRCode
);

// Get QR Code Details - Get details of a specific QR code
router.get(API_ROUTES.QR.QR_DETAILS, getQRCodeDetails);

// Validate QR Code - Validate a QR code and return its data
router.post(API_ROUTES.QR.VALIDATE_QR, validateQRCode);

// Assign QR Code to Vehicle - Assign a QR code to a specific vehicle
router.post(
  API_ROUTES.QR.ASSIGN_QR,
  [
    commonValidations.qrAssignmentId("qr_id"),
    commonValidations.qrVehicleId("vehicle_id"),
    commonValidations.qrAssignedBy("assigend_by"),
    commonValidations.qrUserId("user_id"),
    commonValidations.qrSalesId("sales_id"),
    handleValidationErrors,
  ],
  assignQRToVehicle
);

// Get QR Assignment Details - Get details of a QR assignment
router.get(API_ROUTES.QR.QR_ASSIGNMENT, getQRAssignmentDetails);

// Get Vehicle QR Assignment - Get QR assignment for a specific vehicle
router.get(API_ROUTES.QR.VEHICLE_QR, getVehicleQRAssignment);

module.exports = router;
