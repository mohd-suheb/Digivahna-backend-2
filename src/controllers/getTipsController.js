const TipsTricks = require("../models/TipsTricks");
const { SUCCESS_MESSAGES, ERROR_MESSAGES } = require("../../constants");

/**
 * Get All Vehicle Tips & Tricks - Fetch complete list of tips and tricks
 * GET /api/tips-tricks-list
 */
const getAllTipsList = async (req, res) => {
  try {
    // Get all tips sorted by created_at (latest first)
    const tips = await TipsTricks.find({})
      .sort({ created_at: -1 })
      .select('-__v'); // Exclude version field

    // Check if tips exist
    if (!tips || tips.length === 0) {
      return res.status(404).json({
        status: false,
        message: ERROR_MESSAGES.NO_TIPS_FOUND,
      });
    }

    // Return success response with exact format specified
    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.DATA_FETCHED_SUCCESSFULLY,
      tips_list: tips,
    });

  } catch (error) {
    console.error("Get all tips list error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_ISSUE,
    });
  }
};

module.exports = {
  getAllTipsList,
};

