const express = require("express");
const cors = require("cors");
const connectDB = require("../db_config/index.js");
const { API_ROUTES, FULL_ROUTES, INFO_MESSAGES } = require("../constants");
const { requestLogger } = require("./middleware/logger");

// Import routes
const indexRoutes = require("./routes/index.route.js");
const authRoutes = require("./routes/auth.route.js");
const deviceRoutes = require("./routes/device.route.js");
const emailRoutes = require("./routes/email.route.js");
const policiesRoutes = require("./routes/policies.route.js");
const qrRoutes = require("./routes/qr.route.js");
const fuelRoutes = require("./routes/fuel.route.js");
const garageRoutes = require("./routes/garage.route.js");
const trendingCarsRoutes = require("./routes/trendingCars.route.js");
const fetchTrendingRoutes = require("./routes/fetchTrending.route.js");
const vehicleComparisonRoutes = require("./routes/vehicleComparison.route.js");
const tipsTricksRoutes = require("./routes/tipsTricks.route.js");
const getTipsRoutes = require("./routes/getTips.route.js");
const newsRoutes = require("./routes/news.route.js");
const getNewsRoutes = require("./routes/getNews.route.js");
const qrVideosRoutes = require("./routes/qrVideos.route.js");
// const uploadRoutes = require("./routes/upload.route.js");
// const userDeletionRoutes = require("./routes/userDeletion.route.js");
// const updateUserRoutes = require("./routes/updateUser.route.js");
// const emergencyContactRoutes = require("./routes/emergencyContact.route.js");
// const addressbookRoutes = require("./routes/addressbook.route.js");
// const primaryContactRoutes = require("./routes/primaryContact.route.js");
// const changePasswordRoutes = require("./routes/changePassword.route.js");
// const getDetailsRoutes = require("./routes/getDetails.route.js");
// const notificationRoutes = require("./routes/notification.route.js");
// const notificationListRoutes = require("./routes/notificationList.route.js");
const accessCodeRoutes = require("./routes/accessCode.route.js");
// const vaultAccessRoutes = require("./routes/vaultAccess.route.js");
// const razorpayRoutes = require("./routes/razorpay.route.js");
// const orderRoutes = require("./routes/order.route.js");
// const reviewRoutes = require("./routes/review.route.js");
// const chatRoutes = require("./routes/chat.route.js");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logger middleware - logs all incoming requests with full endpoint
app.use(requestLogger);

// Database connection middleware
app.use(async (req, res, next) => {
  try {
    // Only connect if not already connected
    if (require("mongoose").connection.readyState !== 1) {
      await connectDB();
    }
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    // In serverless, continue without database for graceful degradation
    next();
  }
});

// Use routes
app.use(API_ROUTES.BASE, indexRoutes);
app.use(API_ROUTES.AUTH.BASE, authRoutes);
app.use(API_ROUTES.DEVICE.BASE, deviceRoutes);
app.use(FULL_ROUTES.EMAIL.BASE, emailRoutes);
app.use(FULL_ROUTES.ADMIN.BASE, policiesRoutes);
app.use(FULL_ROUTES.QR.BASE, qrRoutes);
app.use(FULL_ROUTES.FUEL.BASE, fuelRoutes);
app.use(FULL_ROUTES.GARAGE.BASE, garageRoutes);
app.use(FULL_ROUTES.TRENDING_CARS.BASE, trendingCarsRoutes);
app.use(FULL_ROUTES.FETCH_TRENDING.BASE, fetchTrendingRoutes);
app.use(FULL_ROUTES.VEHICLE_COMPARISON.BASE, vehicleComparisonRoutes);
app.use(FULL_ROUTES.TIPS_TRICKS.BASE, tipsTricksRoutes);
app.use(FULL_ROUTES.GET_TIPS.BASE, getTipsRoutes);
app.use(FULL_ROUTES.NEWS.BASE, newsRoutes);
app.use(FULL_ROUTES.GET_NEWS.BASE, getNewsRoutes);
app.use(FULL_ROUTES.QR_VIDEOS.BASE, qrVideosRoutes);
// app.use(FULL_ROUTES.UPLOAD.BASE, uploadRoutes);
// app.use(FULL_ROUTES.USER.BASE, userDeletionRoutes);
// app.use(FULL_ROUTES.UPDATE_USER.BASE, updateUserRoutes);
// app.use(FULL_ROUTES.EMERGENCY_CONTACT.BASE, emergencyContactRoutes);
// app.use(FULL_ROUTES.ADDRESSBOOK.BASE, addressbookRoutes);
// app.use(FULL_ROUTES.PRIMARY_CONTACT.BASE, primaryContactRoutes);
// app.use(FULL_ROUTES.CHANGE_PASSWORD.BASE, changePasswordRoutes);
// app.use(FULL_ROUTES.GET_DETAILS.BASE, getDetailsRoutes);
// app.use(FULL_ROUTES.NOTIFICATION.BASE, notificationRoutes);
// app.use(FULL_ROUTES.NOTIFICATION_LIST.BASE, notificationListRoutes);
app.use(FULL_ROUTES.ACCESS_CODE.BASE, accessCodeRoutes);
// app.use(FULL_ROUTES.VAULT_ACCESS.BASE, vaultAccessRoutes);
// app.use(FULL_ROUTES.RAZORPAY.BASE, razorpayRoutes);
// app.use(FULL_ROUTES.ORDER.BASE, orderRoutes);
// app.use(FULL_ROUTES.REVIEW.BASE, reviewRoutes);
// app.use(FULL_ROUTES.CHAT.BASE, chatRoutes);

console.log("ENDPOINTS", {
  indexRoutes: API_ROUTES.BASE,
  authRoutes: API_ROUTES.AUTH.BASE,
  deviceRoutes: API_ROUTES.DEVICE.BASE,
  emailRoutes: API_ROUTES.EMAIL.BASE,
  policiesRoutes: API_ROUTES.ADMIN.BASE,
  qrRoutes: API_ROUTES.QR.BASE,
  fuelRoutes: API_ROUTES.FUEL.BASE,
  garageRoutes: API_ROUTES.GARAGE.BASE,
  trendingCarsRoutes: API_ROUTES.TRENDING_CARS.BASE,
  fetchTrendingRoutes: API_ROUTES.FETCH_TRENDING.BASE,
  vehicleComparisonRoutes: API_ROUTES.VEHICLE_COMPARISON.BASE,
  tipsTricksRoutes: API_ROUTES.TIPS_TRICKS.BASE,
  getTipsRoutes: API_ROUTES.GET_TIPS.BASE,
  newsRoutes: API_ROUTES.NEWS.BASE,
  getNewsRoutes: API_ROUTES.GET_NEWS.BASE,
  qrVideosRoutes: API_ROUTES.QR_VIDEOS.BASE,
  // uploadRoutes: API_ROUTES.UPLOAD.BASE,
  // userDeletionRoutes: API_ROUTES.USER.BASE,
  // updateUserRoutes: API_ROUTES.UPDATE_USER.BASE,
  // emergencyContactRoutes: API_ROUTES.EMERGENCY_CONTACT.BASE,
  // addressbookRoutes: API_ROUTES.ADDRESSBOOK.BASE,
  // primaryContactRoutes: API_ROUTES.PRIMARY_CONTACT.BASE,
  // changePasswordRoutes: API_ROUTES.CHANGE_PASSWORD.BASE,
  // getDetailsRoutes: API_ROUTES.GET_DETAILS.BASE,
  // notificationRoutes: API_ROUTES.NOTIFICATION.BASE,
  // notificationListRoutes: API_ROUTES.NOTIFICATION_LIST.BASE,
  accessCodeRoutes: API_ROUTES.ACCESS_CODE.BASE,
  // vaultAccessRoutes: API_ROUTES.VAULT_ACCESS.BASE,
  // razorpayRoutes: API_ROUTES.RAZORPAY.BASE,
  // orderRoutes: API_ROUTES.ORDER.BASE,
  // reviewRoutes: API_ROUTES.REVIEW.BASE,
  // chatRoutes: API_ROUTES.CHAT.BASE,

  API_ROUTES: API_ROUTES,
  FULL_ROUTES: FULL_ROUTES,
  INFO_MESSAGES: INFO_MESSAGES,
});

// For Vercel serverless functions
if (process.env.VERCEL === "1") {
  module.exports = app;
} else {
  // For local development
  const PORT = process.env.PORT || 3000;
  const http = require("http");

  // Create HTTP server
  const server = http.createServer(app);

  // Initialize Socket.IO
  const { Server } = require("socket.io");
  const io = new Server(server, {
    cors: {
      origin: "*", // Update this with your frontend URL in production
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Setup Socket.IO handlers
  const { setupSocketIO } = require("./socket/socketHandler.js");
  setupSocketIO(io);

  // Start server
  server.listen(PORT, () => {
    console.log(`🚀 ${INFO_MESSAGES.SERVER_STARTED} ${PORT}`);
    console.log(
      `📊 ${INFO_MESSAGES.HEALTH_CHECK}: http://localhost:${PORT}${API_ROUTES.HEALTH}`
    );
    console.log(`💬 Socket.IO server running on http://localhost:${PORT}`);
  });

  // Export server for potential use in other modules
  module.exports = { app, server, io };
}
