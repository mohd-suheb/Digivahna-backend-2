const express = require("express");
const router = express.Router();
const {
  getPolicies,
  updatePolicyStatus,
  getPolicyStatus,
} = require("../controllers/policiesController.js");
const { API_ROUTES } = require("../../constants/apiRoutes.js");

// Get Policies - Fetch the latest policies and company details pages
router.get(API_ROUTES.ADMIN.GET_POLICIES, getPolicies);

// Update Policy Status - Update the status of a specific policy (Admin only)
router.put(API_ROUTES.ADMIN.UPDATE_POLICY, updatePolicyStatus);

// Get Policy Status - Get the status of a specific policy
router.get(API_ROUTES.ADMIN.GET_POLICY, getPolicyStatus);

module.exports = router;
