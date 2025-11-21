const express = require("express");
const router = express.Router();
const {
  handleValidationErrors,
  commonValidations,
} = require("../middleware/validation.js");
const {
  sendEmail,
  getAvailableTemplates,
  getAvailableSenders,
} = require("../controllers/emailController.js");
const { API_ROUTES } = require("../../constants/apiRoutes.js");

// Send Email - Send custom HTML-styled email with attachments
router.post(
  API_ROUTES.EMAIL.SEND,
  [
    commonValidations.emailSender("sender"),
    commonValidations.emailRecipient("to"),
    commonValidations.emailSubject("subject"),
    commonValidations.emailBody("body"),
    commonValidations.emailSignature("signature"),
    commonValidations.emailAttachments("attachments"),
    handleValidationErrors,
  ],
  sendEmail
);

// Get Available Templates - Get list of available email templates
router.get(API_ROUTES.EMAIL.TEMPLATES, getAvailableTemplates);

// Get Available Senders - Get list of available sender emails
router.get(API_ROUTES.EMAIL.SENDERS, getAvailableSenders);

module.exports = router;
