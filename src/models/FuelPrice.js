const mongoose = require("mongoose");

const fuelPriceSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
    index: true,
  },
  petrol_price: {
    type: Number,
    required: true,
    min: 0,
  },
  diesel_price: {
    type: Number,
    required: true,
    min: 0,
  },
  cng_price: {
    type: Number,
    required: true,
    min: 0,
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
fuelPriceSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

// Static method to get fuel price by state
fuelPriceSchema.statics.getFuelPriceByState = function (state) {
  return this.findOne({ state: state.toUpperCase() });
};

// Static method to get all fuel prices
fuelPriceSchema.statics.getAllFuelPrices = function () {
  return this.find({}, { _id: 0, __v: 0, created_at: 0, updated_at: 0 })
    .sort({ state: 1 });
};

// Static method to update or create fuel price
fuelPriceSchema.statics.updateFuelPrice = function (state, fuelData) {
  return this.findOneAndUpdate(
    { state: state.toUpperCase() },
    {
      state: state.toUpperCase(),
      petrol_price: fuelData.petrol_price,
      diesel_price: fuelData.diesel_price,
      cng_price: fuelData.cng_price,
      last_updated: new Date(),
    },
    { upsert: true, new: true }
  );
};

// Static method to check if state exists
fuelPriceSchema.statics.stateExists = function (state) {
  return this.findOne({ state: state.toUpperCase() });
};

module.exports = mongoose.model("FuelPrice", fuelPriceSchema);
