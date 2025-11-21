const { SUCCESS_MESSAGES, ERROR_MESSAGES } = require("../../constants");

// Load policies configuration
const policiesConfig = require("../../config/policies.json");

/**
 * Get Policies - Fetch the latest policies and company details pages
 * GET /api/admin/get-policies
 */
const getPolicies = async (req, res) => {
  try {
    // Return the policies configuration
    res.status(200).json({
      status: true,
      about_us: policiesConfig.about_us,
      privacy_policy: policiesConfig.privacy_policy,
      data_protection_policy: policiesConfig.data_protection_policy,
      terms_conditions: policiesConfig.terms_conditions,
      refund_policy: policiesConfig.refund_policy,
    });
  } catch (error) {
    console.error("Get policies error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_ERROR,
    });
  }
};

/**
 * Update Policy Status - Update the status of a specific policy (Admin only)
 * PUT /api/admin/update-policy
 */
const updatePolicyStatus = async (req, res) => {
  try {
    const { policy_name, status, url } = req.body;

    // Validate policy name
    const validPolicies = [
      "about_us",
      "privacy_policy", 
      "data_protection_policy",
      "terms_conditions",
      "refund_policy"
    ];

    if (!validPolicies.includes(policy_name)) {
      return res.status(400).json({
        status: false,
        message: "Invalid policy name",
      });
    }

    // Validate status
    const validStatuses = ["Live", "Under_Maintenance"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: false,
        message: "Invalid status. Must be 'Live' or 'Under_Maintenance'",
      });
    }

    // Update the policy configuration
    policiesConfig[policy_name] = {
      status: status,
      url: url || policiesConfig[policy_name].url,
    };

    // In a real application, you would save this to a database
    // For now, we'll just return the updated configuration
    res.status(200).json({
      status: true,
      message: "Policy updated successfully",
      policy: policiesConfig[policy_name],
    });
  } catch (error) {
    console.error("Update policy error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_ERROR,
    });
  }
};

/**
 * Get Policy Status - Get the status of a specific policy
 * GET /api/admin/policy/:policyName
 */
const getPolicyStatus = async (req, res) => {
  try {
    const { policyName } = req.params;

    // Validate policy name
    const validPolicies = [
      "about_us",
      "privacy_policy",
      "data_protection_policy", 
      "terms_conditions",
      "refund_policy"
    ];

    if (!validPolicies.includes(policyName)) {
      return res.status(404).json({
        status: false,
        message: "Policy not found",
      });
    }

    res.status(200).json({
      status: true,
      policy_name: policyName,
      ...policiesConfig[policyName],
    });
  } catch (error) {
    console.error("Get policy status error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_ERROR,
    });
  }
};

module.exports = {
  getPolicies,
  updatePolicyStatus,
  getPolicyStatus,
};
