// Import all models to ensure they are registered with Mongoose
const User = require("../src/models/User");
const TempUser = require("../src/models/TempUser");
const OTP = require("../src/models/OTP");
const AppKeys = require("../src/models/AppKeys");
const DeviceData = require("../src/models/DeviceData");
const QRAssignment = require("../src/models/QRAssignment");
const FuelPrice = require("../src/models/FuelPrice");
const TrendingCars = require("../src/models/TrendingCars");
const VehicleComparison = require("../src/models/VehicleComparison");
const TipsTricks = require("../src/models/TipsTricks");
const News = require("../src/models/News");
const QRVideos = require("../src/models/QRVideos");
const UserDeletion = require("../src/models/UserDeletion");
const Notification = require("../src/models/Notification");
const AccessCode = require("../src/models/AccessCode");
const Order = require("../src/models/Order");
const Review = require("../src/models/Review");
const Chat = require("../src/models/Chat");
const MessageModel = require("../src/models/Message");

// Optional: Create some initial data or perform setup tasks
const initializeModels = async () => {
  try {
    console.log("📋 Models initialized successfully");
    console.log("📊 Available models:");
    console.log("  - User (users collection)");
    console.log("  - TempUser (tempusers collection)");
    console.log("  - OTP (otps collection)");
    console.log("  - AppKeys (appkeys collection)");
    console.log("  - DeviceData (devicedatas collection)");
    console.log("  - QRAssignment (qrassignments collection)");
    console.log("  - FuelPrice (fuelprices collection)");
    console.log("  - UserDeletion (userdeletions collection)");
    console.log("  - Notification (notifications collection)");
    console.log("  - AccessCode (accesscodes collection)");
    console.log("  - Order (orders collection)");
    console.log("  - Review (reviews collection)");
    console.log("  - Chat (chats collection)");
    console.log("  - Message (messages collection)");

    // Optional: Check if collections exist and log their status
    const db = require("mongoose").connection.db;

    if (db) {
      const collections = await db.listCollections().toArray();
      console.log(
        "📁 Existing collections:",
        collections.map((c) => c.name)
      );
    }

    return true;
  } catch (error) {
    console.error("❌ Error initializing models:", error);
    return false;
  }
};

module.exports = {
  initializeModels,
};
