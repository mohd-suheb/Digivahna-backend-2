const express = require("express");
const router = express.Router();
const {
  handleValidationErrors,
  commonValidations,
} = require("../middleware/validation.js");
const { appKeys, deviceData } = require("../controllers/deviceController.js");
const { API_ROUTES } = require("../../constants/apiRoutes.js");

// App Keys - Get or Update app configuration data
router.post(
  API_ROUTES.DEVICE.APP_KEYS,
  [
    commonValidations.hitBy("hit_by"),
    commonValidations.oneSignalId("one_signal_id"),
    commonValidations.appKeysAppVersion("app_version"),
    handleValidationErrors,
  ],
  appKeys
);

// Device Data - Add or Remove user device information
router.post(
  API_ROUTES.DEVICE.DEVICE_DATA,
  [
    commonValidations.deviceHitType("hit_type"),
    commonValidations.userId("user_id"),
    commonValidations.uuid("uuid"),
    commonValidations.deviceName("device_name"),
    commonValidations.deviceVersion("device_version"),
    commonValidations.deviceModel("device_model"),
    commonValidations.deviceAppVersion("app_version"),
    commonValidations.playerId("player_id"),
    handleValidationErrors,
  ],
  deviceData
);

module.exports = router;
