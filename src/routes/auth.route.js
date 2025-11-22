const express = require("express");
const router = express.Router();
const {
  handleValidationErrors,
  commonValidations,
} = require("../middleware/validation.js");
const {
  registerInit,
  verifyOtp,
  resendOtp,
  signIn,
  otpBasedLogin,
  verifyLoginOtp,
  requestResetPassword,
  verifyResetOtp,
  verifyRequest,
  verifyConfirm,
  suspendUser,
  removeUserSuspension,
} = require("../controllers/authController.js");
const { API_ROUTES } = require("../../constants/apiRoutes.js");

// User Registration Init - Step 1: Check user existence or collect user details and send OTP
router.post(
  API_ROUTES.AUTH.REGISTER.INIT,
  [
    commonValidations.firstName("first_name"),
    commonValidations.lastName("last_name"),
    commonValidations.email("email"),
    commonValidations.phone("phone"),
    commonValidations.password("password", 8),
    commonValidations.otpChannel("otp_channel"),
    commonValidations.hitTypeRegisterUser("hit_type"),
    handleValidationErrors,
  ],
  registerInit
);

// User Registration OTP Verification - Step 2: Verify OTP and create account
router.post(
  API_ROUTES.AUTH.REGISTER.VERIFY_OTP,
  (req, res, next) => {
    console.log("📩 VERIFY OTP ROUTE MIDDLEWARE — BODY:", req.body);
    next();
  },
  [
    commonValidations.userRegisterId("user_register_id"),
    commonValidations.otp("otp"),
    handleValidationErrors,
  ],
  verifyOtp
);

// Resend OTP
router.post(
  API_ROUTES.AUTH.REGISTER.RESEND_OTP,
  [
    commonValidations.userRegisterId("user_register_id"),
    handleValidationErrors,
  ],
  resendOtp
);

// Sign In - Authenticate user with email/phone and password
router.post(
  API_ROUTES.AUTH.LOGIN.SIGN_IN,
  [
    commonValidations.loginType("login_type"),
    commonValidations.loginValue("login_value"),
    commonValidations.password("password", 6),
    handleValidationErrors,
  ],
  signIn
);

// OTP Based Login - Send OTP for login
router.post(
  API_ROUTES.AUTH.LOGIN.OTP_BASED_LOGIN,
  [
    commonValidations.loginVia("login_via"),
    commonValidations.loginValue("value"),
    handleValidationErrors,
  ],
  otpBasedLogin
);

// Verify Login OTP - Verify OTP for login
router.post(
  API_ROUTES.AUTH.LOGIN.VERIFY_LOGIN_OTP,
  [
    commonValidations.loginVia("login_via"),
    commonValidations.loginValue("value"),
    commonValidations.otp("otp"),
    handleValidationErrors,
  ],
  verifyLoginOtp
);

// Request Reset Password - Send OTP for password reset
router.post(
  API_ROUTES.AUTH.PASSWORD_RESET.REQUEST,
  [
    commonValidations.forgetWith("forget_with"),
    commonValidations.otpChannel("otp_channel"),
    handleValidationErrors,
  ],
  requestResetPassword
);

// Verify Reset OTP and Change Password - Verify OTP and set new password
router.post(
  API_ROUTES.AUTH.PASSWORD_RESET.VERIFY_OTP,
  [
    commonValidations.forgetWith("forget_with"),
    commonValidations.otpChannel("otp_channel"),
    commonValidations.otp("otp"),
    commonValidations.password("new_password", 6),
    handleValidationErrors,
  ],
  verifyResetOtp
);

// User Verification Request - Send OTP for user verification
router.post(
  API_ROUTES.AUTH.USER_VERIFY.REQUEST,
  [
    commonValidations.otpChannel("otp_channel"),
    commonValidations.verifyTo("verify_to"),
    handleValidationErrors,
  ],
  verifyRequest
);

// User Verification Confirm - Verify OTP for user verification
router.post(
  `${API_ROUTES.AUTH.USER_VERIFY.CONFIRM}/:verificationId`,
  [
    // commonValidations.verificationId("verificationId"),
    commonValidations.verifyTo("verify_to"),
    commonValidations.otpChannel("otp_channel"),
    commonValidations.otp("otp"),
    handleValidationErrors,
  ],
  verifyConfirm
);

// Suspend User - Suspend a user for a specific time period
router.post(
  API_ROUTES.AUTH.USER_MANAGEMENT.SUSPEND,
  [
    commonValidations.userIdForSuspension("user_id"),
    commonValidations.suspendUntil("suspend_until"),
    commonValidations.suspensionReason("reason"),
    handleValidationErrors,
  ],
  suspendUser
);

// Remove User Suspension - Remove suspension from a user
router.post(
  API_ROUTES.AUTH.USER_MANAGEMENT.REMOVE_SUSPENSION,
  [
    commonValidations.userIdForRemoveSuspension("user_id"),
    handleValidationErrors,
  ],
  removeUserSuspension
);

module.exports = router;
