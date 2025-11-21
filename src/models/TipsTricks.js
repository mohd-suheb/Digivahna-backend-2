const mongoose = require("mongoose");

// Tips and Tricks Schema
const tipsTricksSchema = new mongoose.Schema(
  {
    tip_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    banner_url: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    points: [
      {
        icon: {
          type: String,
          required: true,
          trim: true,
        },
        message: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Pre-save middleware to update updated_at timestamp
tipsTricksSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

// Static method to generate unique tip_id
tipsTricksSchema.statics.generateTipId = async function () {
  let tipId;
  let isUnique = false;
  
  while (!isUnique) {
    // Generate tip_id in format: tt_XXXXX
    const randomNum = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    tipId = `tt_${randomNum}`;
    
    // Check if tip_id already exists
    const existingTip = await this.findOne({ tip_id: tipId });
    if (!existingTip) {
      isUnique = true;
    }
  }
  
  return tipId;
};

// Static method to add new tip
tipsTricksSchema.statics.addTip = async function (tipData) {
  try {
    // Generate unique tip_id
    const tipId = await this.generateTipId();
    
    // Create new tip document
    const newTip = new this({
      tip_id: tipId,
      ...tipData,
    });
    
    // Save to database
    const savedTip = await newTip.save();
    return savedTip;
  } catch (error) {
    throw error;
  }
};

// Static method to update existing tip
tipsTricksSchema.statics.updateTip = async function (tipId, tipData) {
  try {
    const updatedTip = await this.findOneAndUpdate(
      { tip_id: tipId },
      { 
        ...tipData,
        updated_at: new Date()
      },
      { new: true, runValidators: true }
    );
    return updatedTip;
  } catch (error) {
    throw error;
  }
};

// Static method to get all tips
tipsTricksSchema.statics.getAllTips = async function () {
  try {
    const tips = await this.find({}).sort({ created_at: -1 });
    return tips;
  } catch (error) {
    throw error;
  }
};

// Static method to get tip by tip_id
tipsTricksSchema.statics.getTipById = async function (tipId) {
  try {
    const tip = await this.findOne({ tip_id: tipId });
    return tip;
  } catch (error) {
    throw error;
  }
};

// Static method to delete tip
tipsTricksSchema.statics.deleteTip = async function (tipId) {
  try {
    const deletedTip = await this.findOneAndDelete({ tip_id: tipId });
    return deletedTip;
  } catch (error) {
    throw error;
  }
};

// Index for better query performance
tipsTricksSchema.index({ tip_id: 1 });
tipsTricksSchema.index({ created_at: -1 });
tipsTricksSchema.index({ title: "text", summary: "text" });

const TipsTricks = mongoose.model("TipsTricks", tipsTricksSchema);

module.exports = TipsTricks;

