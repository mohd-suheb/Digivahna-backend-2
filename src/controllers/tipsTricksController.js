const TipsTricks = require("../models/TipsTricks");
const { SUCCESS_MESSAGES, ERROR_MESSAGES } = require("../../constants");

/**
 * Manage Tips and Tricks - Add new tip or update existing tip
 * POST /api/v1/tips-tricks
 */
const manageTipsTricks = async (req, res) => {
  try {
    const { tip_id, banner_url, title, summary, points } = req.body;

    // Validate required fields
    if (!banner_url || !title || !summary || !points) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Validate points array
    if (!Array.isArray(points) || points.length === 0) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Validate each point in the array
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      if (!point.icon || !point.message) {
        return res.status(400).json({
          status: false,
          error_type: "Invalid parameter",
          message: ERROR_MESSAGES.INVALID_PARAMETER,
        });
      }
    }

    // Validate string fields
    if (typeof banner_url !== 'string' || typeof title !== 'string' || typeof summary !== 'string') {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Prepare tip data
    const tipData = {
      banner_url: banner_url.trim(),
      title: title.trim(),
      summary: summary.trim(),
      points: points.map(point => ({
        icon: point.icon.trim(),
        message: point.message.trim(),
      })),
    };

    // If tip_id is provided, update existing tip
    if (tip_id) {
      return await updateTip(req, res, tip_id, tipData);
    } else {
      // If no tip_id, add new tip
      return await addTip(req, res, tipData);
    }

  } catch (error) {
    console.error("Manage tips and tricks error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_NOT_WORKING,
    });
  }
};

/**
 * Add New Tip
 */
const addTip = async (req, res, tipData) => {
  try {
    // Add the new tip
    const newTip = await TipsTricks.addTip(tipData);

    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.TIPS_TRICKS_ADDED_SUCCESSFULLY,
      data: {
        tip_id: newTip.tip_id,
        title: newTip.title,
      },
    });

  } catch (error) {
    console.error("Add tip error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_NOT_WORKING,
    });
  }
};

/**
 * Update Existing Tip
 */
const updateTip = async (req, res, tipId, tipData) => {
  try {
    // Validate tip_id format
    if (typeof tipId !== 'string' || tipId.trim().length === 0) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Check if tip exists
    const existingTip = await TipsTricks.getTipById(tipId.trim());
    if (!existingTip) {
      return res.status(404).json({
        status: false,
        error_type: "invalid_id",
        message: ERROR_MESSAGES.TIP_ID_DOES_NOT_EXIST,
      });
    }

    // Update the tip
    const updatedTip = await TipsTricks.updateTip(tipId.trim(), tipData);
    if (!updatedTip) {
      return res.status(404).json({
        status: false,
        error_type: "invalid_id",
        message: ERROR_MESSAGES.TIP_ID_DOES_NOT_EXIST,
      });
    }

    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.TIPS_TRICKS_UPDATED_SUCCESSFULLY,
    });

  } catch (error) {
    console.error("Update tip error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_NOT_WORKING,
    });
  }
};

/**
 * Get All Tips and Tricks
 * GET /api/v1/tips-tricks
 */
const getAllTips = async (req, res) => {
  try {
    const tips = await TipsTricks.getAllTips();

    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.TIPS_TRICKS_FETCHED_SUCCESSFULLY,
      data: {
        tips: tips,
        total_count: tips.length,
      },
    });

  } catch (error) {
    console.error("Get all tips error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_NOT_WORKING,
    });
  }
};

/**
 * Get Tip by ID
 * GET /api/v1/tips-tricks/:tip_id
 */
const getTipById = async (req, res) => {
  try {
    const { tip_id } = req.params;

    // Validate tip_id parameter
    if (!tip_id) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Get tip by tip_id
    const tip = await TipsTricks.getTipById(tip_id);
    if (!tip) {
      return res.status(404).json({
        status: false,
        error_type: "invalid_id",
        message: ERROR_MESSAGES.TIP_ID_DOES_NOT_EXIST,
      });
    }

    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.TIP_FETCHED_SUCCESSFULLY,
      data: {
        tip: tip,
      },
    });

  } catch (error) {
    console.error("Get tip by ID error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_NOT_WORKING,
    });
  }
};

/**
 * Delete Tip
 * DELETE /api/v1/tips-tricks/:tip_id
 */
const deleteTip = async (req, res) => {
  try {
    const { tip_id } = req.params;

    // Validate tip_id parameter
    if (!tip_id) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Delete tip
    const deletedTip = await TipsTricks.deleteTip(tip_id);
    if (!deletedTip) {
      return res.status(404).json({
        status: false,
        error_type: "invalid_id",
        message: ERROR_MESSAGES.TIP_ID_DOES_NOT_EXIST,
      });
    }

    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.TIP_DELETED_SUCCESSFULLY,
    });

  } catch (error) {
    console.error("Delete tip error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_NOT_WORKING,
    });
  }
};

module.exports = {
  manageTipsTricks,
  getAllTips,
  getTipById,
  deleteTip,
};

