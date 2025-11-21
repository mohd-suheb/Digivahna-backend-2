# File Upload API Documentation

## Overview

This API provides comprehensive file upload functionality using AWS S3 storage. It supports various file types and includes features for uploading, retrieving, and managing files.

## Unique File ID Generation

The API uses a sophisticated file ID generation system to ensure uniqueness and prevent conflicts:

- **Timestamp**: Each file ID includes a Unix timestamp for chronological ordering
- **Bcrypt Hash**: Uses bcryptjs to generate a cryptographically secure hash
- **Random String**: Includes a random 16-byte hex string for additional entropy
- **Process ID**: Incorporates the process ID for multi-instance deployments
- **Format**: `{timestamp}_{hash}{extension}` (e.g., `1703123456789_a1b2c3d4e5f6g7h8.pdf`)

This approach ensures that even if multiple users upload files with identical names, each file will have a completely unique identifier.

## Base URL

```
/api
```

## Authentication

Some endpoints may require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Upload Single File (General Purpose)

**POST** `/upload/single`

Upload a single file to S3 with general purpose settings.

**Request:**

- **Content-Type:** `multipart/form-data`
- **Body:**
  - `file` (required): The file to upload
  - `folder` (optional): Custom folder name (default: "uploads")

**Supported File Types:**

- Images: JPEG, PNG, GIF, WebP
- Documents: PDF, TXT, DOC, DOCX, XLS, XLSX
- Max file size: 10MB

**Response:**

```json
{
  "status": true,
  "message": "File uploaded successfully",
  "data": {
    "file_id": "uploads/1703123456789_a1b2c3d4e5f6g7h8.pdf",
    "file_url": "https://digivahan-files.s3.us-east-1.amazonaws.com/uploads/1703123456789_a1b2c3d4e5f6g7h8.pdf",
    "original_name": "document.pdf",
    "file_size": 1024000,
    "mime_type": "application/pdf",
    "bucket": "digivahan-files",
    "uploaded_at": "2023-12-21T10:30:00.000Z"
  }
}
```

### 2. Upload Multiple Files (General Purpose)

**POST** `/upload/multiple`

Upload multiple files to S3 with general purpose settings.

**Request:**

- **Content-Type:** `multipart/form-data`
- **Body:**
  - `files` (required): Array of files to upload (max 5 files)
  - `folder` (optional): Custom folder name (default: "uploads")

**Response:**

```json
{
  "status": true,
  "message": "Files uploaded successfully",
  "data": {
    "total_files": 3,
    "successful_uploads": 3,
    "failed_uploads": 0,
    "files": [
      {
        "file_id": "uploads/1703123456789_abc123def456_document1.pdf",
        "file_url": "https://digivahan-files.s3.us-east-1.amazonaws.com/uploads/1703123456789_abc123def456_document1.pdf",
        "original_name": "document1.pdf",
        "file_size": 1024000,
        "mime_type": "application/pdf",
        "bucket": "digivahan-files",
        "uploaded_at": "2023-12-21T10:30:00.000Z"
      }
    ]
  }
}
```

### 3. Upload Profile Image

**POST** `/upload/profile-image`

Upload a profile image specifically for user profiles.

**Request:**

- **Content-Type:** `multipart/form-data`
- **Body:**
  - `file` (required): Image file to upload

**Supported Image Types:**

- JPEG, PNG, GIF, WebP
- Max file size: 5MB

**Response:**

```json
{
  "status": true,
  "message": "Profile image uploaded successfully",
  "data": {
    "file_id": "profile-images/1703123456789_abc123def456_profile.jpg",
    "file_url": "https://digivahan-files.s3.us-east-1.amazonaws.com/profile-images/1703123456789_abc123def456_profile.jpg",
    "original_name": "profile.jpg",
    "file_size": 512000,
    "mime_type": "image/jpeg",
    "uploaded_at": "2023-12-21T10:30:00.000Z"
  }
}
```

### 4. Upload Vehicle Document

**POST** `/upload/vehicle-document`

Upload vehicle-related documents (registration, insurance, etc.).

**Request:**

- **Content-Type:** `multipart/form-data`
- **Body:**
  - `file` (required): Document file to upload
  - `vehicle_id` (optional): Vehicle identifier
  - `document_type` (optional): Type of document (registration, insurance, pollution, fitness, permit, other)

**Supported Document Types:**

- Images: JPEG, PNG
- Documents: PDF
- Max file size: 15MB

**Response:**

```json
{
  "status": true,
  "message": "Vehicle document uploaded successfully",
  "data": {
    "file_id": "vehicle-documents/ABC123/1703123456789_abc123def456_registration.pdf",
    "file_url": "https://digivahan-files.s3.us-east-1.amazonaws.com/vehicle-documents/ABC123/1703123456789_abc123def456_registration.pdf",
    "original_name": "registration.pdf",
    "file_size": 2048000,
    "mime_type": "application/pdf",
    "document_type": "registration",
    "vehicle_id": "ABC123",
    "uploaded_at": "2023-12-21T10:30:00.000Z"
  }
}
```

### 5. Get File Information

**GET** `/file/info/:file_id`

Retrieve detailed information about a specific file.

**Request:**

- **URL Parameters:**
  - `file_id` (required): The file identifier

**Response:**

```json
{
  "status": true,
  "message": "File information retrieved successfully",
  "data": {
    "file_id": "uploads/1703123456789_abc123def456_document.pdf",
    "file_url": "https://digivahan-files.s3.us-east-1.amazonaws.com/uploads/1703123456789_abc123def456_document.pdf",
    "file_size": 1024000,
    "content_type": "application/pdf",
    "last_modified": "2023-12-21T10:30:00.000Z",
    "etag": "\"abc123def456789\""
  }
}
```

### 6. Get File URL

**GET** `/file/url/:file_id`

Get the public URL of a specific file.

**Request:**

- **URL Parameters:**
  - `file_id` (required): The file identifier

**Response:**

```json
{
  "status": true,
  "message": "File URL retrieved successfully",
  "data": {
    "file_id": "uploads/1703123456789_abc123def456_document.pdf",
    "file_url": "https://digivahan-files.s3.us-east-1.amazonaws.com/uploads/1703123456789_abc123def456_document.pdf"
  }
}
```

### 7. Delete File

**DELETE** `/file/delete/:file_id`

Delete a specific file from S3.

**Request:**

- **URL Parameters:**
  - `file_id` (required): The file identifier

**Response:**

```json
{
  "status": true,
  "message": "File deleted successfully",
  "data": {
    "file_id": "uploads/1703123456789_abc123def456_document.pdf",
    "deleted_at": "2023-12-21T10:30:00.000Z"
  }
}
```

## Error Responses

### Validation Error

```json
{
  "status": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "file",
      "message": "No file uploaded",
      "value": null
    }
  ]
}
```

### File Not Found

```json
{
  "status": false,
  "message": "File not found"
}
```

### File Upload Failed

```json
{
  "status": false,
  "message": "File upload failed",
  "error": "File size too large"
}
```

### Invalid File Type

```json
{
  "status": false,
  "message": "Invalid file type. Allowed types: image/jpeg, image/png, image/gif, image/webp"
}
```

## File Naming Convention

Files are automatically renamed using the following pattern:

```
{folder}/{timestamp}_{random_string}_{sanitized_original_name}.{extension}
```

Example:

- Original: `My Document.pdf`
- Generated: `uploads/1703123456789_abc123def456_My_Document.pdf`

## File Organization

Files are organized in S3 buckets with the following folder structure:

- `uploads/` - General purpose files
- `images/` - Image files
- `profile-images/` - User profile images
- `documents/` - Document files
- `vehicle-documents/{vehicle_id}/` - Vehicle-specific documents

## Rate Limits

- Maximum 5 files per multiple upload request
- File size limits vary by endpoint (5MB for images, 10MB for general, 15MB for documents)
- No specific rate limits on API calls (subject to AWS S3 limits)

## Security Considerations

- Files are stored in a public S3 bucket with read access
- File names are sanitized to prevent path traversal attacks
- File types are validated before upload
- File sizes are limited to prevent abuse
- All uploaded files are accessible via public URLs

## Testing with cURL

### Upload Single File

```bash
curl -X POST \
  http://localhost:3000/api/upload/single \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@/path/to/your/file.pdf' \
  -F 'folder=custom-folder'
```

### Upload Multiple Files

```bash
curl -X POST \
  http://localhost:3000/api/upload/multiple \
  -H 'Content-Type: multipart/form-data' \
  -F 'files=@/path/to/file1.pdf' \
  -F 'files=@/path/to/file2.jpg' \
  -F 'folder=custom-folder'
```

### Get File URL

```bash
curl -X GET \
  http://localhost:3000/api/file/url/uploads/1703123456789_abc123def456_document.pdf
```

### Delete File

```bash
curl -X DELETE \
  http://localhost:3000/api/file/delete/uploads/1703123456789_abc123def456_document.pdf
```

## Environment Variables Required

Make sure these environment variables are set in your `.env` file:

```env
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=digivahan-files
```
