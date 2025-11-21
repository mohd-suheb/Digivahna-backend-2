const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const { SUCCESS_MESSAGES, ERROR_MESSAGES } = require("../../constants");

// Load sender configuration
const sendersConfig = require("../../config/senders.json");

// Configure email transport (using existing SES configuration)
const transporter = nodemailer.createTransport({
  host: process.env.SES_SMTP_HOST || "email-smtp.ap-south-1.amazonaws.com",
  port: process.env.SES_SMTP_PORT || 587,
  secure: false, // use STARTTLS
  auth: {
    user: process.env.SES_SMTP_USER,
    pass: process.env.SES_SMTP_PASS,
  },
});

/**
 * Render HTML template with dynamic data
 * @param {string} templateName - Name of the template file (without .html)
 * @param {object} data - Data to inject into the template
 * @returns {string} - Rendered HTML
 */
const renderTemplate = (templateName, data) => {
  try {
    const templatePath = path.join(__dirname, "../templates", `${templateName}.html`);
    
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template ${templateName} not found`);
    }

    let template = fs.readFileSync(templatePath, "utf8");

    // Replace placeholders with actual data
    Object.keys(data).forEach((key) => {
      const placeholder = new RegExp(`{{${key}}}`, "g");
      template = template.replace(placeholder, data[key] || "");
    });

    return template;
  } catch (error) {
    console.error("Template rendering error:", error);
    throw new Error("Template rendering failed");
  }
};

/**
 * Prepare email data with sender information
 * @param {string} senderEmail - Sender email address
 * @param {object} signatureData - Dynamic signature data
 * @returns {object} - Complete email data
 */
const prepareEmailData = (senderEmail, signatureData) => {
  const senderConfig = sendersConfig[senderEmail];
  
  if (!senderConfig) {
    throw new Error("Invalid sender email");
  }

  return {
    ...signatureData,
    sender_name: senderConfig.name,
    sender_role: senderConfig.role,
    sender_email: senderEmail,
    digital_signature_url: senderConfig.digital_signature_url,
  };
};

/**
 * Send Email - Send custom HTML-styled email with attachments
 * POST /api/email/send
 */
const sendEmail = async (req, res) => {
  try {
    const { sender, to, subject, body, signature, attachments } = req.body;

    // Validate sender configuration
    if (!sendersConfig[sender]) {
      return res.status(400).json({
        status: false,
        message: ERROR_MESSAGES.EMAIL_SENDER_NOT_FOUND,
      });
    }

    // Prepare email data with sender information
    const emailData = prepareEmailData(sender, signature);

    // Render HTML template
    let htmlContent;
    try {
      htmlContent = renderTemplate(body, emailData);
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: ERROR_MESSAGES.EMAIL_TEMPLATE_NOT_FOUND,
      });
    }

    // Prepare email options
    const mailOptions = {
      from: sender,
      to: to,
      subject: subject,
      html: htmlContent,
    };

    // Add attachments if provided
    if (attachments && attachments.length > 0) {
      mailOptions.attachments = attachments.map((attachment) => {
        if (typeof attachment === "string") {
          // If attachment is a URL or file path
          return {
            filename: path.basename(attachment),
            path: attachment,
          };
        } else if (attachment.content && attachment.filename) {
          // If attachment is base64 content
          return {
            filename: attachment.filename,
            content: attachment.content,
            encoding: attachment.encoding || "base64",
          };
        } else {
          throw new Error("Invalid attachment format");
        }
      });
    }

    // Send email
    const result = await transporter.sendMail(mailOptions);

    console.log(`📧 Email sent successfully to ${to} from ${sender}`);
    console.log(`Message ID: ${result.messageId}`);

    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.EMAIL_SENT_SUCCESSFULLY,
      from: sender,
      to: to,
      subject: subject,
    });
  } catch (error) {
    console.error("Send email error:", error);
    
    // Handle specific error types
    if (error.message.includes("Template")) {
      return res.status(400).json({
        status: false,
        message: ERROR_MESSAGES.EMAIL_TEMPLATE_NOT_FOUND,
      });
    }
    
    if (error.message.includes("Invalid sender")) {
      return res.status(400).json({
        status: false,
        message: ERROR_MESSAGES.EMAIL_SENDER_NOT_FOUND,
      });
    }

    if (error.message.includes("attachment")) {
      return res.status(400).json({
        status: false,
        message: ERROR_MESSAGES.EMAIL_ATTACHMENT_ERROR,
      });
    }

    res.status(500).json({
      status: false,
      message: ERROR_MESSAGES.EMAIL_SEND_FAILED,
    });
  }
};

/**
 * Get Available Templates - Get list of available email templates
 * GET /api/email/templates
 */
const getAvailableTemplates = async (req, res) => {
  try {
    const templatesDir = path.join(__dirname, "../templates");
    const files = fs.readdirSync(templatesDir);
    
    const templates = files
      .filter((file) => file.endsWith(".html"))
      .map((file) => file.replace(".html", ""));

    res.status(200).json({
      status: true,
      message: "Available templates retrieved successfully",
      templates: templates,
    });
  } catch (error) {
    console.error("Get templates error:", error);
    res.status(500).json({
      status: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * Get Available Senders - Get list of available sender emails
 * GET /api/email/senders
 */
const getAvailableSenders = async (req, res) => {
  try {
    const senders = Object.keys(sendersConfig).map((email) => ({
      email: email,
      name: sendersConfig[email].name,
      role: sendersConfig[email].role,
    }));

    res.status(200).json({
      status: true,
      message: "Available senders retrieved successfully",
      senders: senders,
    });
  } catch (error) {
    console.error("Get senders error:", error);
    res.status(500).json({
      status: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

module.exports = {
  sendEmail,
  getAvailableTemplates,
  getAvailableSenders,
};
