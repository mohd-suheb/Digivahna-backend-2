const AccessCode = require("../models/AccessCode");
const User = require("../models/User");
const { SUCCESS_MESSAGES, ERROR_MESSAGES } = require("../../constants");

/**
 * Access Code Controller
 * Handles document access code verification and management
 */

/**
 * Verify access code for document access
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const verifyAccessCode = async (req, res) => {
  try {
    const { user_id, vehicle_id } = req.body;

    // Validate required fields
    if (!user_id || !vehicle_id) {
      return res.status(400).json({
        status: false,
        error_type: "other",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Find user by email or phone
    const user = await User.findByEmailOrPhone(user_id);
    if (!user) {
      return res.status(404).json({
        status: false,
        error_type: "userId",
        message: ERROR_MESSAGES.INVALID_USER_ID,
      });
    }

    // Check if user is active and not deleted
    if (user.account_status === "DELETED") {
      return res.status(403).json({
        status: false,
        error_type: "userId",
        message: ERROR_MESSAGES.INVALID_USER_ID,
      });
    }

    // Find active access code for the vehicle
    const accessCode = await AccessCode.findByVehicle(vehicle_id);
    if (!accessCode) {
      return res.status(404).json({
        status: false,
        error_type: "code",
        message: ERROR_MESSAGES.NO_REQUEST_RAISED,
      });
    }

    // Check if access code can be used
    if (!accessCode.canBeUsed()) {
      if (accessCode.isExpired()) {
        return res.status(400).json({
          status: false,
          error_type: "code",
          message: ERROR_MESSAGES.ACCESS_CODE_EXPIRED,
        });
      }
      
      if (accessCode.status === "USED") {
        return res.status(400).json({
          status: false,
          error_type: "code",
          message: ERROR_MESSAGES.ACCESS_CODE_ALREADY_USED,
        });
      }

      return res.status(400).json({
        status: false,
        error_type: "code",
        message: ERROR_MESSAGES.ACCESS_CODE_INVALID,
      });
    }

    // Get vehicle documents from user's garage
    const vehicle = user.garage?.vehicles?.find(v => v.vehicle_id === vehicle_id);
    if (!vehicle) {
      return res.status(404).json({
        status: false,
        error_type: "vehicle",
        message: ERROR_MESSAGES.VEHICLE_NOT_FOUND,
      });
    }

    // Increment access count
    await accessCode.incrementAccess();

    // Format documents response
    const documents = {
      rc: vehicle.vehicle_documents?.registration?.file_url || "",
      insurance: vehicle.vehicle_documents?.insurance?.file_url || "",
      puc: vehicle.vehicle_documents?.pollution?.file_url || "",
      other: vehicle.vehicle_documents?.other_documents || []
    };

    return res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.VAULT_ACCESS_GRANTED,
      data: {
        vehicle_number: vehicle.vehicle_info?.vehicle_number || "",
        security_code: accessCode.security_code,
        documents: documents,
        access_info: {
          expires_at: accessCode.expires_at,
          access_count: accessCode.access_count,
          max_access_count: accessCode.max_access_count
        }
      }
    });

  } catch (error) {
    console.error("Error in verifyAccessCode:", error);
    return res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_ISSUE,
    });
  }
};

/**
 * Generate access code for document sharing
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const generateAccessCode = async (req, res) => {
  try {
    const { user_id, vehicle_id, max_access_count = 1 } = req.body;

    // Validate required fields
    if (!user_id || !vehicle_id) {
      return res.status(400).json({
        status: false,
        error_type: "other",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Find user by email or phone
    const user = await User.findByEmailOrPhone(user_id);
    if (!user) {
      return res.status(404).json({
        status: false,
        error_type: "userId",
        message: ERROR_MESSAGES.INVALID_USER_ID,
      });
    }

    // Check if user is active and not deleted
    if (user.account_status === "DELETED") {
      return res.status(403).json({
        status: false,
        error_type: "userId",
        message: ERROR_MESSAGES.INVALID_USER_ID,
      });
    }

    // Check if vehicle exists in user's garage
    const vehicle = user.garage?.vehicles?.find(v => v.vehicle_id === vehicle_id);
    if (!vehicle) {
      return res.status(404).json({
        status: false,
        error_type: "vehicle",
        message: ERROR_MESSAGES.VEHICLE_NOT_FOUND,
      });
    }

    // Cancel any existing active access codes for this vehicle
    await AccessCode.updateMany(
      { vehicle_id: vehicle_id, status: "ACTIVE" },
      { status: "CANCELLED" }
    );

    // Generate new access code
    const securityCode = AccessCode.generateSecurityCode();
    
    // Create new access code
    const accessCode = new AccessCode({
      user_id: user._id,
      vehicle_id: vehicle_id,
      security_code: securityCode,
      vehicle_number: vehicle.vehicle_info?.vehicle_number || "",
      max_access_count: parseInt(max_access_count),
      request_ip: req.ip || req.connection.remoteAddress,
      user_agent: req.get('User-Agent') || ""
    });

    await accessCode.save();

    return res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.ACCESS_CODE_GENERATED,
      data: {
        vehicle_id: vehicle_id,
        vehicle_number: vehicle.vehicle_info?.vehicle_number || "",
        security_code: securityCode,
        expires_at: accessCode.expires_at,
        max_access_count: accessCode.max_access_count
      }
    });

  } catch (error) {
    console.error("Error in generateAccessCode:", error);
    return res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_ISSUE,
    });
  }
};

/**
 * Get access code status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAccessCodeStatus = async (req, res) => {
  try {
    const { user_id, vehicle_id } = req.params;

    if (!user_id || !vehicle_id) {
      return res.status(400).json({
        status: false,
        error_type: "other",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Find user by email or phone
    const user = await User.findByEmailOrPhone(user_id);
    if (!user) {
      return res.status(404).json({
        status: false,
        error_type: "userId",
        message: ERROR_MESSAGES.INVALID_USER_ID,
      });
    }

    // Find access code for the vehicle
    const accessCode = await AccessCode.findByVehicle(vehicle_id);
    if (!accessCode) {
      return res.status(404).json({
        status: false,
        error_type: "code",
        message: ERROR_MESSAGES.NO_REQUEST_RAISED,
      });
    }

    return res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.ACCESS_CODE_STATUS_RETRIEVED,
      data: {
        vehicle_id: accessCode.vehicle_id,
        vehicle_number: accessCode.vehicle_number,
        security_code: accessCode.security_code,
        status: accessCode.status,
        expires_at: accessCode.expires_at,
        access_count: accessCode.access_count,
        max_access_count: accessCode.max_access_count,
        created_at: accessCode.createdAt,
        is_expired: accessCode.isExpired(),
        can_be_used: accessCode.canBeUsed()
      }
    });

  } catch (error) {
    console.error("Error in getAccessCodeStatus:", error);
    return res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_ISSUE,
    });
  }
};

/**
 * Cancel access code
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const cancelAccessCode = async (req, res) => {
  try {
    const { user_id, vehicle_id } = req.body;

    if (!user_id || !vehicle_id) {
      return res.status(400).json({
        status: false,
        error_type: "other",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Find user by email or phone
    const user = await User.findByEmailOrPhone(user_id);
    if (!user) {
      return res.status(404).json({
        status: false,
        error_type: "userId",
        message: ERROR_MESSAGES.INVALID_USER_ID,
      });
    }

    // Find and cancel active access code
    const result = await AccessCode.updateMany(
      { 
        user_id: user._id,
        vehicle_id: vehicle_id, 
        status: "ACTIVE" 
      },
      { status: "CANCELLED" }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({
        status: false,
        error_type: "code",
        message: ERROR_MESSAGES.NO_ACTIVE_ACCESS_CODE,
      });
    }

    return res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.ACCESS_CODE_CANCELLED,
      data: {
        cancelled_count: result.modifiedCount
      }
    });

  } catch (error) {
    console.error("Error in cancelAccessCode:", error);
    return res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_ISSUE,
    });
  }
};

/**
 * Cleanup expired access codes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const cleanupExpiredAccessCodes = async (req, res) => {
  try {
    const result = await AccessCode.cleanupExpired();

    return res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.EXPIRED_ACCESS_CODES_CLEANED_UP,
      data: {
        updated_count: result.modifiedCount
      }
    });

  } catch (error) {
    console.error("Error in cleanupExpiredAccessCodes:", error);
    return res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_ISSUE,
    });
  }
};

module.exports = {
  verifyAccessCode,
  generateAccessCode,
  getAccessCodeStatus,
  cancelAccessCode,
  cleanupExpiredAccessCodes,
};
