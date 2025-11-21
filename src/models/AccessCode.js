const mongoose = require("mongoose");

const accessCodeSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      index: true,
    },
    requester_id: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    vehicle_id: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    security_code: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    vehicle_number: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "USED", "EXPIRED", "CANCELLED"],
      default: "ACTIVE",
      index: true,
    },
    expires_at: {
      type: Date,
      required: true,
      index: true,
    },
    used_at: {
      type: Date,
      default: null,
    },
    request_ip: {
      type: String,
      default: "",
    },
    user_agent: {
      type: String,
      default: "",
    },
    access_count: {
      type: Number,
      default: 0,
    },
    max_access_count: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

// Indexes for better performance
accessCodeSchema.index({ vehicle_id: 1, security_code: 1 });
accessCodeSchema.index({ security_code: 1, status: 1 });
accessCodeSchema.index({ expires_at: 1, status: 1 });
accessCodeSchema.index({ user_id: 1, vehicle_id: 1 });

// Static method to find active access code
accessCodeSchema.statics.findActiveCode = function (vehicleId, securityCode) {
  return this.findOne({
    vehicle_id: vehicleId,
    security_code: securityCode,
    status: "ACTIVE",
    expires_at: { $gt: new Date() },
  });
};

// Static method to find access code by vehicle
accessCodeSchema.statics.findByVehicle = function (vehicleId) {
  return this.findOne({
    vehicle_id: vehicleId,
    status: "ACTIVE",
    expires_at: { $gt: new Date() },
  }).sort({ createdAt: -1 });
};

// Static method to cleanup expired codes
accessCodeSchema.statics.cleanupExpired = function () {
  return this.updateMany(
    {
      status: "ACTIVE",
      expires_at: { $lt: new Date() },
    },
    { status: "EXPIRED" }
  );
};

// Static method to generate unique security code
accessCodeSchema.statics.generateSecurityCode = function () {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit code
};

// Instance method to check if code is expired
accessCodeSchema.methods.isExpired = function () {
  return this.expires_at < new Date();
};

// Instance method to check if code can be used
accessCodeSchema.methods.canBeUsed = function () {
  return (
    this.status === "ACTIVE" &&
    !this.isExpired() &&
    this.access_count < this.max_access_count
  );
};

// Instance method to mark as used
accessCodeSchema.methods.markAsUsed = function () {
  this.status = "USED";
  this.used_at = new Date();
  this.access_count += 1;
  return this.save();
};

// Instance method to increment access count
accessCodeSchema.methods.incrementAccess = function () {
  this.access_count += 1;
  if (this.access_count >= this.max_access_count) {
    this.status = "USED";
    this.used_at = new Date();
  }
  return this.save();
};

// Pre-save middleware to set expiry time
accessCodeSchema.pre("save", function (next) {
  if (this.isNew && !this.expires_at) {
    // Set expiry to 10 minutes from creation
    this.expires_at = new Date(Date.now() + 10 * 60 * 1000);
  }
  next();
});

module.exports = mongoose.model("AccessCode", accessCodeSchema);
