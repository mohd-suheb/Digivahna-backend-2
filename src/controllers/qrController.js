const QRCode = require('qrcode');
const crypto = require('crypto');
const { SUCCESS_MESSAGES, ERROR_MESSAGES } = require("../../constants");
const QRAssignment = require("../models/QRAssignment");
const User = require("../models/User");

/**
 * Generate unique QR ID
 * @returns {string} - Unique QR ID
 */
const generateQRId = () => {
  return crypto.randomBytes(16).toString('hex');
};

/**
 * Generate QR Code - Generate QR codes based on provided parameters
 * POST /api/generate-qr
 */
const generateQRCode = async (req, res) => {
  try {
    const { generer_id, qr_unit, genreated_by } = req.body;

    // Validate input parameters
    if (!generer_id || !qr_unit || !genreated_by) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Convert qr_unit to number
    const unitCount = parseInt(qr_unit);
    if (isNaN(unitCount) || unitCount <= 0 || unitCount > 100) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    const qrList = [];

    // Generate QR codes based on qr_unit
    for (let i = 0; i < unitCount; i++) {
      const qrId = generateQRId();
      
      // Create QR data payload
      const qrData = {
        qr_id: qrId,
        generer_id: generer_id,
        generated_by: genreated_by,
        timestamp: new Date().toISOString(),
        unit_number: i + 1,
        total_units: unitCount
      };

      // Generate QR code data URL
      let qrImageUrl;
      try {
        const qrDataString = JSON.stringify(qrData);
        qrImageUrl = await QRCode.toDataURL(qrDataString, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
      } catch (qrError) {
        console.error("QR Code generation error:", qrError);
        return res.status(500).json({
          status: false,
          error_type: "other",
          message: ERROR_MESSAGES.QR_GENERATION_FAILED,
        });
      }

      // Create QR list entry
      const qrEntry = {
        qr_image: `https://digivahan.in/api/Qr_cloud_storage/qr_id-${qrId}`,
        qr_data: `https://digivahan.in/api/send-notification-page/qr_id-${qrId}`
      };

      qrList.push(qrEntry);

      // In a real application, you would:
      // 1. Save the QR code image to cloud storage
      // 2. Store the QR data in database
      // 3. Update the URLs with actual cloud storage URLs
      
      console.log(`Generated QR Code ${i + 1}/${unitCount} for generer_id: ${generer_id}`);
    }

    // Return success response
    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.QR_GENERATED_SUCCESSFULLY,
      qr_list: qrList,
    });

  } catch (error) {
    console.error("Generate QR Code error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_ISSUE,
    });
  }
};

/**
 * Get QR Code Details - Get details of a specific QR code
 * GET /api/qr/:qrId
 */
const getQRCodeDetails = async (req, res) => {
  try {
    const { qrId } = req.params;

    if (!qrId) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // In a real application, you would fetch this from database
    // For now, return mock data
    res.status(200).json({
      status: true,
      message: "QR Code details retrieved successfully",
      qr_id: qrId,
      qr_image: `https://digivahan.in/api/Qr_cloud_storage/qr_id-${qrId}`,
      qr_data: `https://digivahan.in/api/send-notification-page/qr_id-${qrId}`,
      status: "active",
      created_at: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Get QR Code details error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_ISSUE,
    });
  }
};

/**
 * Validate QR Code - Validate a QR code and return its data
 * POST /api/validate-qr
 */
const validateQRCode = async (req, res) => {
  try {
    const { qr_data } = req.body;

    if (!qr_data) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // In a real application, you would:
    // 1. Parse the QR data
    // 2. Validate against database
    // 3. Return appropriate response

    res.status(200).json({
      status: true,
      message: "QR Code validated successfully",
      qr_data: qr_data,
      is_valid: true,
      validated_at: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Validate QR Code error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_ISSUE,
    });
  }
};

/**
 * Assign QR Code to Vehicle - Assign a QR code to a specific vehicle
 * POST /api/assign-qr
 */
const assignQRToVehicle = async (req, res) => {
  try {
    const { qr_id, vehicle_id, assigend_by, user_id, sales_id } = req.body;

    // Step 1: Check if QR ID is valid and not already assigned
    const existingQRAssignment = await QRAssignment.isQRAssigned(qr_id);
    if (existingQRAssignment) {
      return res.status(400).json({
        status: false,
        error_type: "already_assigned",
        message: ERROR_MESSAGES.QR_ALREADY_ASSIGNED,
      });
    }

    // Step 2: Check if QR exists and has proper structure (simulate QR validation)
    // In a real application, you would check against a QR codes collection
    if (!qr_id || qr_id.length < 5) {
      return res.status(400).json({
        status: false,
        error_type: "damaged",
        message: ERROR_MESSAGES.QR_DAMAGED,
      });
    }

    // Step 3: Check if vehicle is already assigned to any QR
    const existingVehicleAssignment = await QRAssignment.isVehicleAssigned(vehicle_id);
    if (existingVehicleAssignment) {
      return res.status(400).json({
        status: false,
        error_type: "vehicle_assigned",
        message: ERROR_MESSAGES.VEHICLE_ALREADY_ASSIGNED,
      });
    }

    // Step 4: Validate user_id or sales_id based on assigned_by
    if (assigend_by === "user") {
      if (!user_id) {
        return res.status(400).json({
          status: false,
          error_type: "Invalid parameter",
          message: ERROR_MESSAGES.INVALID_PARAMETER,
        });
      }
      
      // Check if user exists
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(400).json({
          status: false,
          error_type: "Invalid id",
          message: ERROR_MESSAGES.INVALID_QR_ID,
        });
      }
    } else if (assigend_by === "sales") {
      if (!sales_id) {
        return res.status(400).json({
          status: false,
          error_type: "Invalid parameter",
          message: ERROR_MESSAGES.INVALID_PARAMETER,
        });
      }
    }

    // Step 5: Create QR assignment
    const qrAssignment = new QRAssignment({
      qr_id,
      vehicle_id,
      assigned_by: assigend_by,
      user_id: assigend_by === "user" ? user_id : undefined,
      sales_id: assigend_by === "sales" ? sales_id : undefined,
      status: "active",
      assigned_at: new Date(),
    });

    await qrAssignment.save();

    // Step 6: Update vehicle details in user's garage (if user assignment)
    if (assigend_by === "user" && user_id) {
      const user = await User.findById(user_id);
      if (user && user.garage && user.garage.vehicles) {
        const vehicle = user.garage.vehicles.find(v => v.vehicle_number === vehicle_id);
        if (vehicle) {
          vehicle.qr_id = qr_id;
          vehicle.qr_assigned_at = new Date();
          await user.save();
        }
      }
    }

    console.log(`QR Code ${qr_id} assigned to vehicle ${vehicle_id} by ${assigend_by}`);

    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.QR_ASSIGNED_SUCCESSFULLY,
      assigned_qr_id: qr_id,
    });

  } catch (error) {
    console.error("Assign QR to Vehicle error:", error);
    
    // Handle specific error types
    if (error.code === 11000) {
      return res.status(400).json({
        status: false,
        error_type: "already_assigned",
        message: ERROR_MESSAGES.QR_ALREADY_ASSIGNED,
      });
    }

    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_ISSUE,
    });
  }
};

/**
 * Get QR Assignment Details - Get details of a QR assignment
 * GET /api/qr-assignment/:qrId
 */
const getQRAssignmentDetails = async (req, res) => {
  try {
    const { qrId } = req.params;

    const assignment = await QRAssignment.findByQRId(qrId);
    
    if (!assignment) {
      return res.status(404).json({
        status: false,
        error_type: "Invalid id",
        message: ERROR_MESSAGES.INVALID_QR_ID,
      });
    }

    res.status(200).json({
      status: true,
      message: "QR assignment details retrieved successfully",
      assignment: {
        qr_id: assignment.qr_id,
        vehicle_id: assignment.vehicle_id,
        assigned_by: assignment.assigned_by,
        user_id: assignment.user_id,
        sales_id: assignment.sales_id,
        status: assignment.status,
        assigned_at: assignment.assigned_at,
      },
    });

  } catch (error) {
    console.error("Get QR assignment details error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_ISSUE,
    });
  }
};

/**
 * Get Vehicle QR Assignment - Get QR assignment for a specific vehicle
 * GET /api/vehicle-qr/:vehicleId
 */
const getVehicleQRAssignment = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    const assignment = await QRAssignment.findByVehicleId(vehicleId);
    
    if (!assignment) {
      return res.status(404).json({
        status: false,
        message: "No QR code assigned to this vehicle",
      });
    }

    res.status(200).json({
      status: true,
      message: "Vehicle QR assignment retrieved successfully",
      assignment: {
        qr_id: assignment.qr_id,
        vehicle_id: assignment.vehicle_id,
        assigned_by: assignment.assigned_by,
        user_id: assignment.user_id,
        sales_id: assignment.sales_id,
        status: assignment.status,
        assigned_at: assignment.assigned_at,
      },
    });

  } catch (error) {
    console.error("Get vehicle QR assignment error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_ISSUE,
    });
  }
};

module.exports = {
  generateQRCode,
  getQRCodeDetails,
  validateQRCode,
  assignQRToVehicle,
  getQRAssignmentDetails,
  getVehicleQRAssignment,
};
