const mongoose = require("mongoose");

// Trending Cars Schema
const trendingCarsSchema = new mongoose.Schema(
  {
    car_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    brand_name: {
      type: String,
      required: true,
      trim: true,
    },
    model_name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    price_display: {
      type: String,
      required: true,
      trim: true,
    },
    mileage: {
      type: String,
      required: true,
      trim: true,
    },
    top_speed: {
      type: String,
      required: true,
      trim: true,
    },
    image_url: {
      type: String,
      required: true,
      trim: true,
    },
    specifications: {
      engine_capacity: {
        type: String,
        required: true,
        trim: true,
      },
      transmission: {
        type: String,
        required: true,
        trim: true,
      },
      fuel_tank_capacity: {
        type: String,
        required: true,
        trim: true,
      },
      seat_height: {
        type: String,
        required: true,
        trim: true,
      },
      kerb_weight: {
        type: String,
        required: true,
        trim: true,
      },
    },
    detailed_specifications: {
      max_power: {
        type: String,
        required: true,
        trim: true,
      },
      max_torque: {
        type: String,
        required: true,
        trim: true,
      },
      riding_mode: {
        type: String,
        required: true,
        trim: true,
      },
      gear_shifting_pattern: {
        type: String,
        required: true,
        trim: true,
      },
    },
    dimensions: {
      bootspace: {
        type: String,
        required: true,
        trim: true,
      },
      ground_clearance: {
        type: String,
        required: true,
        trim: true,
      },
      length: {
        type: String,
        required: true,
        trim: true,
      },
      width: {
        type: String,
        required: true,
        trim: true,
      },
      height: {
        type: String,
        required: true,
        trim: true,
      },
    },
    features: {
      air_conditioner: {
        type: Boolean,
        required: true,
      },
      central_locking: {
        type: String,
        required: true,
        trim: true,
      },
      power_windows: {
        type: String,
        required: true,
        trim: true,
      },
      headrest: {
        type: String,
        required: true,
        trim: true,
      },
      parking_assist: {
        type: String,
        required: true,
        trim: true,
      },
      cruise_control: {
        type: Boolean,
        required: true,
      },
      music_system_count: {
        type: Number,
        required: true,
        min: 0,
      },
      apple_carplay: {
        type: String,
        required: true,
        trim: true,
      },
      android_auto: {
        type: String,
        required: true,
        trim: true,
      },
      abs: {
        type: Boolean,
        required: true,
      },
      sunroof: {
        type: Boolean,
        required: true,
      },
      third_row_ac: {
        type: Boolean,
        required: true,
      },
      airbags: {
        type: [String],
        required: true,
        validate: {
          validator: function (v) {
            return v && v.length > 0;
          },
          message: "At least one airbag type must be specified",
        },
      },
    },
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
trendingCarsSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

// Static method to generate unique car_id
trendingCarsSchema.statics.generateCarId = async function () {
  let carId;
  let isUnique = false;
  
  while (!isUnique) {
    // Generate car_id in format: car_XXXXX
    const randomNum = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    carId = `car_${randomNum}`;
    
    // Check if car_id already exists
    const existingCar = await this.findOne({ car_id: carId });
    if (!existingCar) {
      isUnique = true;
    }
  }
  
  return carId;
};

// Static method to add a new trending car
trendingCarsSchema.statics.addTrendingCar = async function (carData) {
  try {
    // Generate unique car_id
    const carId = await this.generateCarId();
    
    // Create new car document
    const newCar = new this({
      car_id: carId,
      ...carData,
    });
    
    // Save to database
    const savedCar = await newCar.save();
    return savedCar;
  } catch (error) {
    throw error;
  }
};

// Static method to delete a trending car by car_id
trendingCarsSchema.statics.deleteTrendingCar = async function (carId) {
  try {
    const deletedCar = await this.findOneAndDelete({ car_id: carId });
    return deletedCar;
  } catch (error) {
    throw error;
  }
};

// Static method to get all trending cars
trendingCarsSchema.statics.getAllTrendingCars = async function () {
  try {
    const cars = await this.find({}).sort({ created_at: -1 });
    return cars;
  } catch (error) {
    throw error;
  }
};

// Static method to get top trending cars (limited to 4)
trendingCarsSchema.statics.getTopTrendingCars = async function (limit = 4) {
  try {
    const cars = await this.find({}).sort({ created_at: -1 }).limit(limit);
    return cars;
  } catch (error) {
    throw error;
  }
};

// Static method to get trending car by car_id
trendingCarsSchema.statics.getTrendingCarById = async function (carId) {
  try {
    const car = await this.findOne({ car_id: carId });
    return car;
  } catch (error) {
    throw error;
  }
};

// Index for better query performance
trendingCarsSchema.index({ car_id: 1 });
trendingCarsSchema.index({ brand_name: 1, model_name: 1 });
trendingCarsSchema.index({ created_at: -1 });

const TrendingCars = mongoose.model("TrendingCars", trendingCarsSchema);

module.exports = TrendingCars;
