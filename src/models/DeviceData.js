const mongoose = require("mongoose");

const deviceDataSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    index: true,
  },
  device_name: {
    type: String,
    default: "",
  },
  device_version: {
    type: String,
    default: "",
  },
  device_model: {
    type: String,
    default: "",
  },
  app_version: {
    type: String,
    default: "",
  },
  player_id: {
    type: String,
    default: "",
  },
  uuid: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Update updated_at field before saving
deviceDataSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

// Static method to add device
deviceDataSchema.statics.addDevice = function (deviceData) {
  return this.create(deviceData);
};

// Static method to remove device by UUID
deviceDataSchema.statics.removeDevice = function (userId, uuid) {
  return this.findOneAndDelete({ user_id: userId, uuid: uuid });
};

// Static method to find device by UUID
deviceDataSchema.statics.findByUuid = function (uuid) {
  return this.findOne({ uuid: uuid });
};

// Static method to get user devices
deviceDataSchema.statics.getUserDevices = function (userId) {
  return this.find(
    { user_id: userId },
    { _id: 0, __v: 0, created_at: 0, updated_at: 0 }
  );
};

module.exports = mongoose.model("DeviceData", deviceDataSchema);
