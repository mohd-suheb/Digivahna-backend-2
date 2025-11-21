const mongoose = require("mongoose");

/**
 * User Deletion Schema
 * Tracks user account deletion requests and schedules
 */
const userDeletionSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    deletion_type: {
      type: String,
      required: true,
      enum: ["all", "status"],
      default: "all",
    },
    deletion_time_in_days: {
      type: Number,
      required: true,
      min: 0,
      max: 30,
      default: 7,
    },
    deletion_date: {
      type: Date,
      required: true,
      index: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["PENDING_DELETION", "CANCELLED", "COMPLETED"],
      default: "PENDING_DELETION",
      index: true,
    },
    cancelled_at: {
      type: Date,
      default: null,
    },
    completed_at: {
      type: Date,
      default: null,
    },
    qr_ids: [{
      type: String,
      trim: true,
    }],
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
userDeletionSchema.index({ deletion_date: 1, status: 1 });
userDeletionSchema.index({ user_id: 1, status: 1 });

// Pre-save middleware to calculate deletion date
userDeletionSchema.pre("save", function (next) {
  if (this.isNew && this.deletion_time_in_days === 0) {
    // Immediate deletion
    this.deletion_date = new Date();
  } else if (this.isNew) {
    // Schedule deletion
    const deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate() + this.deletion_time_in_days);
    this.deletion_date = deletionDate;
  }
  next();
});

// Static methods
userDeletionSchema.statics.findByUserId = function (userId) {
  return this.findOne({ user_id: userId, status: "PENDING_DELETION" });
};

userDeletionSchema.statics.findPendingDeletions = function (date) {
  return this.find({
    status: "PENDING_DELETION",
    deletion_date: { $lte: date },
  });
};

userDeletionSchema.statics.cancelDeletion = function (userId) {
  return this.findOneAndUpdate(
    { user_id: userId, status: "PENDING_DELETION" },
    {
      status: "CANCELLED",
      cancelled_at: new Date(),
    },
    { new: true }
  );
};

userDeletionSchema.statics.completeDeletion = function (userId) {
  return this.findOneAndUpdate(
    { user_id: userId, status: "PENDING_DELETION" },
    {
      status: "COMPLETED",
      completed_at: new Date(),
    },
    { new: true }
  );
};

// Instance methods
userDeletionSchema.methods.isDeletionDue = function () {
  return new Date() >= this.deletion_date;
};

userDeletionSchema.methods.cancel = function () {
  this.status = "CANCELLED";
  this.cancelled_at = new Date();
  return this.save();
};

userDeletionSchema.methods.complete = function () {
  this.status = "COMPLETED";
  this.completed_at = new Date();
  return this.save();
};

module.exports = mongoose.model("UserDeletion", userDeletionSchema);
