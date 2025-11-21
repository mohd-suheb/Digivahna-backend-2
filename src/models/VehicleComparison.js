const mongoose = require("mongoose");

// Vehicle Comparison Schema
const vehicleComparisonSchema = new mongoose.Schema(
  {
    comparison_id: {
      type: String,
      required: true,
      unique: true,
      // index: true,
    },
    car_1_id: {
      type: String,
      required: true,
      trim: true,
    },
    car_2_id: {
      type: String,
      required: true,
      trim: true,
    },
    car_1_data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    car_2_data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    comparison_metadata: {
      created_at: {
        type: Date,
        default: Date.now,
      },
      updated_at: {
        type: Date,
        default: Date.now,
      },
      comparison_count: {
        type: Number,
        default: 1,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Pre-save middleware to update updated_at timestamp
vehicleComparisonSchema.pre("save", function (next) {
  this.comparison_metadata.updated_at = new Date();
  next();
});

// Static method to generate unique comparison_id
vehicleComparisonSchema.statics.generateComparisonId = async function () {
  let comparisonId;
  let isUnique = false;
  
  while (!isUnique) {
    // Generate comparison_id in format: comp_XXXXX
    const randomNum = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    comparisonId = `comp_${randomNum}`;
    
    // Check if comparison_id already exists
    const existingComparison = await this.findOne({ comparison_id: comparisonId });
    if (!existingComparison) {
      isUnique = true;
    }
  }
  
  return comparisonId;
};

// Static method to create or update comparison
vehicleComparisonSchema.statics.createOrUpdateComparison = async function (car1Id, car2Id, car1Data, car2Data) {
  try {
    // Check if comparison already exists (either direction)
    let existingComparison = await this.findOne({
      $or: [
        { car_1_id: car1Id, car_2_id: car2Id },
        { car_1_id: car2Id, car_2_id: car1Id }
      ]
    });

    if (existingComparison) {
      // Update existing comparison
      existingComparison.car_1_id = car1Id;
      existingComparison.car_2_id = car2Id;
      existingComparison.car_1_data = car1Data;
      existingComparison.car_2_data = car2Data;
      existingComparison.comparison_metadata.comparison_count += 1;
      existingComparison.comparison_metadata.updated_at = new Date();
      
      const updatedComparison = await existingComparison.save();
      return updatedComparison;
    } else {
      // Create new comparison
      const comparisonId = await this.generateComparisonId();
      
      const newComparison = new this({
        comparison_id: comparisonId,
        car_1_id: car1Id,
        car_2_id: car2Id,
        car_1_data: car1Data,
        car_2_data: car2Data,
        comparison_metadata: {
          created_at: new Date(),
          updated_at: new Date(),
          comparison_count: 1,
        },
      });
      
      const savedComparison = await newComparison.save();
      return savedComparison;
    }
  } catch (error) {
    throw error;
  }
};

// Static method to get all comparisons
vehicleComparisonSchema.statics.getAllComparisons = async function () {
  try {
    const comparisons = await this.find({}).sort({ 'comparison_metadata.updated_at': -1 });
    return comparisons;
  } catch (error) {
    throw error;
  }
};

// Static method to get comparison by comparison_id
vehicleComparisonSchema.statics.getComparisonById = async function (comparisonId) {
  try {
    const comparison = await this.findOne({ comparison_id: comparisonId });
    return comparison;
  } catch (error) {
    throw error;
  }
};

// Static method to get comparison by car IDs
vehicleComparisonSchema.statics.getComparisonByCarIds = async function (car1Id, car2Id) {
  try {
    const comparison = await this.findOne({
      $or: [
        { car_1_id: car1Id, car_2_id: car2Id },
        { car_1_id: car2Id, car_2_id: car1Id }
      ]
    });
    return comparison;
  } catch (error) {
    throw error;
  }
};

// Static method to delete comparison
vehicleComparisonSchema.statics.deleteComparison = async function (comparisonId) {
  try {
    const deletedComparison = await this.findOneAndDelete({ comparison_id: comparisonId });
    return deletedComparison;
  } catch (error) {
    throw error;
  }
};

// Index for better query performance
vehicleComparisonSchema.index({ comparison_id: 1 });
vehicleComparisonSchema.index({ car_1_id: 1, car_2_id: 1 });
vehicleComparisonSchema.index({ 'comparison_metadata.updated_at': -1 });

const VehicleComparison = mongoose.model("VehicleComparison", vehicleComparisonSchema);

module.exports = VehicleComparison;

