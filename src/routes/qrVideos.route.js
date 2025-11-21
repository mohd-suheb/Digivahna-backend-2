const express = require("express");
const router = express.Router();
const {
  handleValidationErrors,
  commonValidations,
} = require("../middleware/validation.js");
const {
  qrBenefitVideos,
  getAllQRVideos,
  getQRVideoById,
} = require("../controllers/qrVideosController.js");
const { API_ROUTES } = require("../../constants/apiRoutes.js");

// QR Benefit Videos - Manipulate QR service benefit videos list
router.post(
  API_ROUTES.QR_VIDEOS_UPDATE.MANAGE,
  [
    // Optional validation for all parameters since behavior depends on which parameters are provided
    commonValidations.optionalTutorialVideoId("tutorial_video_id"),
    commonValidations.optionalVideoTitle("title"),
    commonValidations.optionalTutorialVideo("tutorial_video"),
    commonValidations.optionalTutorialThumbnail("tutorial_thumbnail"),
    handleValidationErrors,
  ],
  qrBenefitVideos
);

// Get All QR Videos - Get all QR benefit videos
router.get(API_ROUTES.QR_VIDEOS_UPDATE.GET_ALL, getAllQRVideos);

// Get QR Video by ID - Get specific QR video
router.get(
  API_ROUTES.QR_VIDEOS_UPDATE.GET_BY_ID,
  [
    commonValidations.tutorialVideoIdParam("tutorial_video_id"),
    handleValidationErrors,
  ],
  getQRVideoById
);

module.exports = router;
