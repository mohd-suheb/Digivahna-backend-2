const mongoose = require("mongoose");

const appKeysSchema = new mongoose.Schema({
  one_signal_id: {
    type: String,
    default: "",
  },
  app_version: {
    type: String,
    default: "",
  },
  last_updated: {
    type: Date,
    default: Date.now,
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
appKeysSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

// Static method to get app data
appKeysSchema.statics.getAppData = function () {
  return this.findOne({}, { _id: 0, __v: 0, created_at: 0, updated_at: 0 });
};

// Static method to update app data
appKeysSchema.statics.updateAppData = function (oneSignalId, appVersion) {
  return this.findOneAndUpdate(
    {},
    {
      one_signal_id: oneSignalId || "",
      app_version: appVersion || "",
      last_updated: new Date(),
    },
    { upsert: true, new: true }
  );
};

module.exports = mongoose.model("AppKeys", appKeysSchema);
