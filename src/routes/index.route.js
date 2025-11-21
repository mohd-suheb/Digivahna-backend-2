const express = require("express");
const router = express.Router();
const {
  API_ROUTES,
  SUCCESS_MESSAGES,
  INFO_MESSAGES,
} = require("../../constants");

// Base API route
router.get(API_ROUTES.BASE, (req, res) => {
  res.json({
    message: INFO_MESSAGES.API_WELCOME,
    status: SUCCESS_MESSAGES.SERVER_RUNNING,
    timestamp: new Date().toISOString(),
  });
});

// Health check route
router.get(API_ROUTES.HEALTH, (req, res) => {
  res.json({
    status: SUCCESS_MESSAGES.HEALTH_OK,
    database: SUCCESS_MESSAGES.DATABASE_CONNECTED,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
