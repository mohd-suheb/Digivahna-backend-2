const {
  S3Client,
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

// Configure AWS SDK v3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// S3 configuration
const s3Config = {
  bucket: process.env.AWS_S3_BUCKET_NAME || "digivahan-files",
  region: process.env.AWS_REGION || "ap-south-1",
};

/**
 * Generate unique filename with timestamp and bcrypt hash
 * @param {string} originalName - Original filename
 * @param {string} prefix - Optional prefix for the file
 * @returns {string} - Unique filename
 */
const generateUniqueFilename = (originalName, prefix = "") => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(16).toString("hex");

  // Create a unique hash using bcrypt with timestamp + random string + original name
  const hashInput = `${timestamp}_${randomString}_${originalName}`;
  const uniqueHash = bcrypt
    .hashSync(hashInput, 10)
    .replace(/[^a-zA-Z0-9]/g, "");

  const extension = path.extname(originalName);

  // Create a shorter, cleaner file ID
  const fileId = `${timestamp}_${uniqueHash.substring(0, 12)}${extension}`;

  if (prefix) {
    return `${prefix}/${fileId}`;
  }

  return fileId;
};

/**
 * Generate completely unique file ID without original filename
 * @param {string} originalName - Original filename (for extension only)
 * @param {string} prefix - Optional prefix for the file
 * @returns {string} - Completely unique file ID
 */
const generateUniqueFileId = (originalName, prefix = "") => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(16).toString("hex");

  // Create a unique hash using bcrypt with timestamp + random string + process ID
  const hashInput = `${timestamp}_${randomString}_${process.pid}`;
  const uniqueHash = bcrypt
    .hashSync(hashInput, 10)
    .replace(/[^a-zA-Z0-9]/g, "");

  const extension = path.extname(originalName);

  // Create a completely unique file ID
  const fileId = `${timestamp}_${uniqueHash.substring(0, 16)}${extension}`;

  if (prefix) {
    return `${prefix}/${fileId}`;
  }

  return fileId;
};

/**
 * Get file URL from S3
 * @param {string} key - S3 object key
 * @returns {string} - Public URL of the file
 */
const getFileUrl = (key) => {
  return `https://${s3Config.bucket}.s3.${s3Config.region}.amazonaws.com/${key}`;
};

/**
 * Delete file from S3
 * @param {string} key - S3 object key
 * @returns {Promise<boolean>} - Success status
 */
const deleteFileFromS3 = async (key) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: s3Config.bucket,
      Key: key,
    });

    await s3Client.send(command);
    console.log(`✅ File deleted from S3: ${key}`);
    return true;
  } catch (error) {
    console.error(`❌ Error deleting file from S3: ${error.message}`);
    return false;
  }
};

/**
 * Check if file exists in S3
 * @param {string} key - S3 object key
 * @returns {Promise<boolean>} - File existence status
 */
const checkFileExists = async (key) => {
  try {
    const command = new HeadObjectCommand({
      Bucket: s3Config.bucket,
      Key: key,
    });
    await s3Client.send(command);
    return true;
  } catch (error) {
    if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
      return false;
    }
    throw error;
  }
};

/**
 * Get file metadata from S3
 * @param {string} key - S3 object key
 * @returns {Promise<Object>} - File metadata
 */
const getFileMetadata = async (key) => {
  try {
    const command = new HeadObjectCommand({
      Bucket: s3Config.bucket,
      Key: key,
    });

    const data = await s3Client.send(command);
    return {
      size: data.ContentLength,
      lastModified: data.LastModified,
      contentType: data.ContentType,
      etag: data.ETag,
    };
  } catch (error) {
    console.error(`❌ Error getting file metadata: ${error.message}`);
    throw error;
  }
};

/**
 * Configure multer for S3 upload
 * @param {Object} options - Upload options
 * @returns {Object} - Multer configuration
 */
const configureMulterS3 = (options = {}) => {
  const {
    allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "text/plain",
    ],
    maxFileSize = 10 * 1024 * 1024, // 10MB
    folder = "uploads",
    fileFilter = null,
  } = options;

  // Use memory storage instead of multer-s3 to avoid compatibility issues
  const storage = multer.memoryStorage();

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: maxFileSize,
      files: 5, // Maximum 5 files per request
    },
    fileFilter:
      fileFilter ||
      function (req, file, cb) {
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new Error(
              `Invalid file type. Allowed types: ${allowedMimeTypes.join(", ")}`
            ),
            false
          );
        }
      },
  });

  return upload;
};

/**
 * Upload single file to S3
 * @param {Object} file - Multer file object
 * @param {string} folder - S3 folder path
 * @returns {Promise<Object>} - Upload result
 */
const uploadSingleFile = async (file, folder = "uploads") => {
  try {
    const uniqueFilename = generateUniqueFileId(file.originalname, folder);

    const command = new PutObjectCommand({
      Bucket: s3Config.bucket,
      Key: uniqueFilename,
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: {
        originalName: file.originalname,
        uploadedAt: new Date().toISOString(),
      },
    });

    const result = await s3Client.send(command);

    // Generate the file URL
    const fileUrl = getFileUrl(uniqueFilename);

    return {
      success: true,
      key: uniqueFilename,
      url: fileUrl,
      bucket: s3Config.bucket,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  } catch (error) {
    console.error("❌ Error uploading file to S3:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Upload multiple files to S3
 * @param {Array} files - Array of multer file objects
 * @param {string} folder - S3 folder path
 * @returns {Promise<Array>} - Upload results
 */
const uploadMultipleFiles = async (files, folder = "uploads") => {
  const uploadPromises = files.map((file) => uploadSingleFile(file, folder));
  return Promise.all(uploadPromises);
};

module.exports = {
  s3Client,
  s3Config,
  generateUniqueFilename,
  generateUniqueFileId,
  getFileUrl,
  deleteFileFromS3,
  checkFileExists,
  getFileMetadata,
  configureMulterS3,
  uploadSingleFile,
  uploadMultipleFiles,
};
