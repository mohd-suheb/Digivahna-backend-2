const AppKeys = require("../models/AppKeys");
const DeviceData = require("../models/DeviceData");
const { SUCCESS_MESSAGES, ERROR_MESSAGES } = require("../../constants");

/**
 * App Keys - Get or Update app configuration data
 * POST /api/device/app_keys
 */
const appKeys = async (req, res) => {
  try {
    const { hit_by, one_signal_id, app_version } = req.body;

    // Validate hit_by parameter
    if (!["user", "server"].includes(hit_by)) {
      return res.status(400).json({
        status: false,
        error_type: "other",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    if (hit_by === "server") {
      // Server is updating the app keys
      try {
        await AppKeys.updateAppData(one_signal_id, app_version);

        res.status(200).json({
          status: true,
          success_type: "server",
          message: SUCCESS_MESSAGES.KEYS_UPDATED_SUCCESSFULLY,
        });
      } catch (error) {
        console.error("Error updating app keys:", error);
        res.status(500).json({
          status: false,
          error_type: "server",
          message: SUCCESS_MESSAGES.DATA_NOT_UPDATED,
        });
      }
    } else {
      // User is requesting app data
      try {
        const appData = await AppKeys.getAppData();

        if (!appData) {
          return res.status(404).json({
            status: false,
            error_type: "user",
            message: SUCCESS_MESSAGES.DATA_NOT_FOUND,
          });
        }

        // Format the response as per specification
        const responseData = {
          one_signal_id: appData.one_signal_id || "",
          app_version: appData.app_version || "",
          last_updated: appData.last_updated
            ? new Date(appData.last_updated).toLocaleDateString("en-GB")
            : new Date().toLocaleDateString("en-GB"),
        };

        res.status(200).json({
          status: true,
          success_type: "user",
          data: responseData,
        });
      } catch (error) {
        console.error("Error fetching app keys:", error);
        res.status(500).json({
          status: false,
          error_type: "other",
          message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
      }
    }
  } catch (error) {
    console.error("App keys error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * Device Data - Add or Remove user device information
 * POST /api/device/device_data
 */
const deviceData = async (req, res) => {
  try {
    const {
      hit_type,
      user_id,
      device_name,
      device_version,
      device_model,
      app_version,
      player_id,
      uuid,
    } = req.body;

    // Validate hit_type parameter
    if (!["add", "remove"].includes(hit_type)) {
      return res.status(400).json({
        status: false,
        error_type: "other",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    if (hit_type === "add") {
      // Add device to the list
      try {
        // Check if device with same UUID already exists
        const existingDevice = await DeviceData.findByUuid(uuid);
        if (existingDevice) {
          // Update existing device
          existingDevice.user_id = user_id;
          existingDevice.device_name = device_name || "";
          existingDevice.device_version = device_version || "";
          existingDevice.device_model = device_model || "";
          existingDevice.app_version = app_version || "";
          existingDevice.player_id = player_id || "";
          await existingDevice.save();
        } else {
          // Create new device
          await DeviceData.addDevice({
            user_id,
            device_name: device_name || "",
            device_version: device_version || "",
            device_model: device_model || "",
            app_version: app_version || "",
            player_id: player_id || "",
            uuid,
          });
        }

        res.status(200).json({
          status: true,
          message: SUCCESS_MESSAGES.DEVICE_ADDED_SUCCESSFULLY,
        });
      } catch (error) {
        console.error("Error adding device:", error);
        res.status(500).json({
          status: false,
          error_type: "other",
          message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
      }
    } else {
      // Remove device from the list
      try {
        const removedDevice = await DeviceData.removeDevice(user_id, uuid);

        if (!removedDevice) {
          return res.status(404).json({
            status: false,
            error_type: "other",
            message: SUCCESS_MESSAGES.UUID_NOT_FOUND,
          });
        }

        res.status(200).json({
          status: true,
          message: SUCCESS_MESSAGES.DEVICE_REMOVED_SUCCESSFULLY,
        });
      } catch (error) {
        console.error("Error removing device:", error);
        res.status(500).json({
          status: false,
          error_type: "other",
          message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
      }
    }
  } catch (error) {
    console.error("Device data error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

module.exports = {
  appKeys,
  deviceData,
};
