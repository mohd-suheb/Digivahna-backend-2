# DigiVahan Backend API Documentation

## Overview

This is the backend API for DigiVahan, a vehicle management system. The API provides user registration with OTP verification, user management, and vehicle tracking features.

## Base URL

```
http://localhost:3000
```

## Authentication Flow

### 1. Sign In

**Endpoint:** `POST /api/auth/sign-in`

**Description:** Authenticate user with email/phone and password.

**Request Body:**

```json
{
  "login_type": "email",
  "login_value": "example@gmail.com",
  "password": "User@12345"
}
```

**Response (Success):**

```json
{
  "status": true,
  "message": "Login successful",
  "user": {
    "basic_details": {
      "profile_pic_url": "",
      "first_name": "",
      "last_name": "",
      "phone_number": "",
      "phone_number_verified": true,
      "is_phone_number_primary": true,
      "email": "",
      "is_email_verified": false,
      "is_email_primary": true,
      "password": "",
      "occupation": "",
      "profile_completion_percent": 0
    },
    "public_details": {
      "nick_name": "",
      "address": "",
      "age": 0,
      "gender": ""
    },
    "old_passwords": {
      "previous_password1": "",
      "previous_password2": "",
      "previous_password3": "",
      "previous_password4": ""
    },
    "live_tracking": {
      "is_tracking_on": false
    },
    "notifications": [],
    "my_orders": [],
    "address_book": [],
    "chat_box": [],
    "emergency_contacts": [],
    "garage": {
      "security_code": "",
      "vehicles": []
    }
  },
  "token": "jwt_token_here"
}
```

**Response (Error - Invalid Credentials):**

```json
{
  "status": false,
  "message": "Invalid email/phone or password"
}
```

**Response (Error - Account Not Verified):**

```json
{
  "status": false,
  "message": "Please verify your account before login"
}
```

### 2. OTP Based Login

**Endpoint:** `POST /api/auth/otp-based-login`

**Description:** Send OTP for login authentication.

**Request Body:**

```json
{
  "login_via": "email",
  "value": "abc@gmail.com"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "OTP sent successfully",
  "otp_valid_till": "2025-08-06T18:35:00Z",
  "attempts_left": 2,
  "verify_otp_url": "/api/auth/verify-login-otp"
}
```

**Response (Error - User Not Found):**

```json
{
  "success": false,
  "message": "User not found with this email/phone"
}
```

**Response (Error - Daily Limit Reached):**

```json
{
  "success": false,
  "message": "OTP limit reached for today. Try again tomorrow."
}
```

### 3. Verify Login OTP

**Endpoint:** `POST /api/auth/verify-login-otp`

**Description:** Verify OTP for login authentication.

**Request Body:**

```json
{
  "login_via": "email",
  "value": "abc@gmail.com",
  "otp": "123456"
}
```

**Response (Success):**

```json
{
  "status": "success",
  "message": "OTP verified successfully",
  "user": {
    "basic_details": {
      "profile_pic_url": "",
      "first_name": "",
      "last_name": "",
      "phone_number": "",
      "phone_number_verified": true,
      "is_phone_number_primary": true,
      "email": "",
      "is_email_verified": false,
      "is_email_primary": true,
      "password": "",
      "occupation": "",
      "profile_completion_percent": 0
    },
    "public_details": {
      "nick_name": "",
      "address": "",
      "age": 0,
      "gender": ""
    },
    "old_passwords": {
      "previous_password1": "",
      "previous_password2": "",
      "previous_password3": "",
      "previous_password4": ""
    },
    "live_tracking": {
      "is_tracking_on": false
    },
    "notifications": [],
    "my_orders": [],
    "address_book": [],
    "chat_box": [],
    "emergency_contacts": [],
    "garage": {
      "security_code": "",
      "vehicles": []
    }
  },
  "token": "jwt_token_here"
}
```

**Response (Error - Invalid OTP):**

```json
{
  "status": "error",
  "message": "Invalid or expired OTP"
}
```

### 4. Request Reset Password

**Endpoint:** `POST /api/auth/request-reset-password`

**Description:** Send OTP for password reset authentication.

**Request Body:**

```json
{
  "identifier": "abc@gmail.com",
  "otp_channel": "email"
}
```

**Note:** `otp_channel` accepts both "email"/"EMAIL" and "phone"/"PHONE" (case-insensitive).

**Response (Success):**

```json
{
  "success": true,
  "message": "OTP sent successfully",
  "otp_valid_till": "2025-08-06T18:35:00Z",
  "attempts_left": 2,
  "verify_otp_url": "/api/auth/verify-reset-otp"
}
```

**Response (Error - User Not Found):**

```json
{
  "success": false,
  "message": "User not found with this email/phone"
}
```

**Response (Error - Daily Limit Reached):**

```json
{
  "success": false,
  "message": "OTP limit reached for today. Try again tomorrow."
}
```

### 5. Verify Reset OTP and Change Password

**Endpoint:** `POST /api/auth/verify-reset-otp`

**Description:** Verify OTP and set new password for password reset.

**Request Body:**

```json
{
  "identifier": "abc@gmail.com",
  "otp_channel": "email",
  "otp": "123456",
  "new_password": "NewPassword123"
}
```

**Note:** `otp_channel` accepts both "email"/"EMAIL" and "phone"/"PHONE" (case-insensitive).

**Response (Success):**

```json
{
  "success": true,
  "message": "Password reset successful",
  "login": true,
  "token": "JWT_TOKEN_STRING",
  "user": {
    "basic_details": {
      "profile_pic_url": "",
      "first_name": "",
      "last_name": "",
      "phone_number": "",
      "phone_number_verified": true,
      "is_phone_number_primary": true,
      "email": "",
      "is_email_verified": false,
      "is_email_primary": true,
      "password": "",
      "occupation": "",
      "profile_completion_percent": 0
    },
    "public_details": {
      "nick_name": "",
      "address": "",
      "age": 0,
      "gender": ""
    },
    "old_passwords": {
      "previous_password1": "",
      "previous_password2": "",
      "previous_password3": "",
      "previous_password4": ""
    },
    "live_tracking": {
      "is_tracking_on": false
    },
    "notifications": [],
    "my_orders": [],
    "address_book": [],
    "chat_box": [],
    "emergency_contacts": [],
    "garage": {
      "security_code": "",
      "vehicles": []
    }
  }
}
```

**Response (Error - Invalid OTP):**

```json
{
  "success": false,
  "message": "Invalid or expired OTP"
}
```

**Response (Error - Same Password):**

```json
{
  "success": false,
  "message": "New password must be different from current password"
}
```

**Response (Error - Old Password Reuse):**

```json
{
  "success": false,
  "message": "New password cannot be one of your last 4 passwords"
}
```

### 6. User Registration Init

**Endpoint:** `POST /api/auth/register/init`

**Description:** Step 1 of user registration. Collects user details and sends OTP via selected channel.

**Request Body:**

```json
{
  "first_name": "Mustafa",
  "last_name": "Hasan",
  "email": "mustafa@email.com",
  "phone": "9876543210",
  "password": "StrongPass123",
  "otp_channel": "phone",
  "api_hit_type": "check_user_exists"
}
```

**Note:** `api_hit_type` is optional. When set to "check_user_exists", the API will only check if user exists without proceeding with registration.

**Note:** `otp_channel` accepts both "email"/"EMAIL" and "phone"/"PHONE" (case-insensitive).

**Response (Success):**

```json
{
  "status": true,
  "message": "OTP sent via phone.",
  "valid_until": "2025-08-06T17:21:00Z",
  "attempts_today": 1,
  "otp_verify_endpoint": "auth/register/verify-otp",
  "temp_user_id": "abc123xyz"
}
```

**Response (Error - User Already Exists):**

```json
{
  "status": false,
  "message": "User already exists with this email or phone number"
}
```

**Response (Error - Daily Limit Reached):**

```json
{
  "status": false,
  "message": "OTP limit reached for today. Try again tomorrow."
}
```

### 2. OTP Verification

**Endpoint:** `POST /api/auth/register/verify-otp`

**Description:** Step 2 of user registration. Verifies OTP and creates user account.

**Request Body:**

```json
{
  "temp_user_id": "abc123xyz",
  "otp": "123456"
}
```

**Response (Success):**

```json
{
  "status": true,
  "message": "OTP verified. Account created successfully.",
  "user": {
    "basic_details": {
      "profile_pic_url": "",
      "first_name": "Mustafa",
      "last_name": "Hasan",
      "phone_number": "9876543210",
      "phone_number_verified": true,
      "is_phone_number_primary": true,
      "email": "mustafa@email.com",
      "is_email_verified": false,
      "is_email_primary": false,
      "password": "",
      "occupation": "",
      "profile_completion_percent": 20
    },
    "public_details": {
      "nick_name": "",
      "address": "",
      "age": 0,
      "gender": ""
    },
    "old_passwords": {
      "previous_password1": "",
      "previous_password2": "",
      "previous_password3": "",
      "previous_password4": ""
    },
    "live_tracking": {
      "is_tracking_on": false
    },
    "notifications": [],
    "my_orders": [],
    "address_book": [],
    "chat_box": [],
    "emergency_contacts": [],
    "garage": {
      "security_code": "",
      "vehicles": []
    }
  },
  "token": "jwt_token_here"
}
```

**Response (Error):**

```json
{
  "status": false,
  "message": "Invalid or expired OTP. Please try again."
}
```

### 3. Resend OTP

**Endpoint:** `POST /api/auth/register/resend-otp`

**Description:** Resends OTP to the user's registered contact method.

**Request Body:**

```json
{
  "temp_user_id": "abc123xyz"
}
```

**Response (Success):**

```json
{
  "status": true,
  "message": "OTP resent via phone.",
  "valid_until": "2025-08-06T17:31:00Z",
  "attempts_today": 2,
  "otp_verify_endpoint": "/api/auth/register/verify-otp"
}
```

### 7. User Verification Request

**Endpoint:** `POST /api/auth/user/verify/request`

**Description:** Send OTP for user verification (email or phone verification).

**Request Body:**

```json
{
  "medium": "email",
  "value": "abc@gmail.com"
}
```

**Response (Success):**

```json
{
  "message": "OTP sent successfully",
  "otp_verification_endpoint": "https://digivahan.in/api/auth/user/verify/confirm/abc123xyz",
  "otp_valid_till": "2025-08-06T18:35:00Z"
}
```

**Response (Error - User Not Found):**

```json
{
  "message": "User not found with this email/phone",
  "error": "VERIFY_404"
}
```

**Response (Error - Already Verified):**

```json
{
  "message": "Email is already verified",
  "error": "VERIFY_400"
}
```

**Response (Error - Daily Limit Reached):**

```json
{
  "message": "OTP limit reached for today. Try again tomorrow.",
  "error": "VERIFY_429"
}
```

### 8. User Verification Confirm

**Endpoint:** `POST /api/auth/user/verify/confirm/:verificationId`

**Description:** Verify OTP for user verification.

**Request Body:**

```json
{
  "otp": "123456"
}
```

**Response (Success):**

```json
{
  "message": "Email verified successfully",
  "verified_medium": "email",
  "timestamp": "2025-08-06T18:35:00Z"
}
```

**Response (Error - Invalid OTP):**

```json
{
  "message": "OTP is incorrect or expired",
  "error": "OTP_INVALID"
}
```

## User Management APIs

### 1. Suspend User

**Endpoint:** `POST /api/auth/suspend-user`

**Description:** Suspend a user for a specific time period. Suspended users cannot login or access protected services until the suspension period expires.

**Authentication:** No Authentication Required

**Request Body:**

```json
{
  "user_id": "66b29a5f89d3a9c5cabc1234",
  "suspend_until": "2025-08-20T12:00:00Z",
  "reason": "Violation of terms and conditions"
}
```

**Response (Success):**

```json
{
  "status": true,
  "message": "User suspended successfully",
  "data": {
    "user_id": "66b29a5f89d3a9c5cabc1234",
    "suspended_till": "2025-08-20T12:00:00Z",
    "reason": "Violation of terms and conditions"
  }
}
```

**Response (Error - User Not Found):**

```json
{
  "status": false,
  "message": "User not found"
}
```

**Response (Error - User Already Suspended):**

```json
{
  "status": false,
  "message": "User is already suspended",
  "data": {
    "user_id": "66b29a5f89d3a9c5cabc1234",
    "suspended_till": "2025-08-20T12:00:00Z",
    "reason": "Previous violation"
  }
}
```

**Response (Error - Invalid Date):**

```json
{
  "status": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "suspend_until",
      "message": "Suspension date cannot be in the past",
      "value": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 2. Remove User Suspension

**Endpoint:** `POST /api/auth/remove-suspension`

**Description:** Remove suspension from a user so they can access the system again.

**Authentication:** No Authentication Required

**Request Body:**

```json
{
  "user_id": "64e6b58a2d834e001f0a1234"
}
```

**Response (Success):**

```json
{
  "status": true,
  "message": "User activated successfully"
}
```

**Response (Error - User ID Invalid):**

```json
{
  "status": false,
  "message": "User ID is invalid"
}
```

**Response (Error - User Not Found or Not Suspended):**

```json
{
  "status": false,
  "message": "User not found or not suspended"
}
```

**Response (Error - Server Issue):**

```json
{
  "status": false,
  "message": "Server Issue"
}
```

## Email Management APIs

### 1. Send Email

**Endpoint:** `POST /api/email/send`

**Description:** Send custom HTML-styled email with attachments and dynamic digital signature based on sender identity.

**Authentication:** No Authentication Required

**Request Body:**

```json
{
  "sender": "hr@digivahan.in",
  "to": "zaid@example.com",
  "subject": "Termination of Employment – Digivahan Digital India Pvt. Ltd.",
  "body": "termination",
  "signature": {
    "employee_name": "John Doe",
    "termination_date": "2025-01-31"
  },
  "attachments": [
    {
      "filename": "termination-letter.pdf",
      "content": "base64-encoded-content",
      "encoding": "base64"
    }
  ]
}
```

**Response (Success):**

```json
{
  "status": true,
  "message": "Email sent successfully.",
  "from": "hr@digivahan.in",
  "to": "zaid@example.com",
  "subject": "Termination of Employment – Digivahan Digital India Pvt. Ltd."
}
```

**Response (Error - Invalid Sender):**

```json
{
  "status": false,
  "message": "Invalid sender email or missing template"
}
```

**Response (Error - Template Not Found):**

```json
{
  "status": false,
  "message": "Email template not found"
}
```

### 2. Get Available Templates

**Endpoint:** `GET /api/email/templates`

**Description:** Get list of available email templates.

**Authentication:** No Authentication Required

**Response (Success):**

```json
{
  "status": true,
  "message": "Available templates retrieved successfully",
  "templates": ["termination", "welcome", "otp"]
}
```

### 3. Get Available Senders

**Endpoint:** `GET /api/email/senders`

**Description:** Get list of available sender emails with their configuration.

**Authentication:** No Authentication Required

**Response (Success):**

```json
{
  "status": true,
  "message": "Available senders retrieved successfully",
  "senders": [
    {
      "email": "hr@digivahan.in",
      "name": "HR Team",
      "role": "Human Resource Department"
    },
    {
      "email": "info@digivahan.in",
      "name": "Digivahan Info Team",
      "role": "Information Desk"
    }
  ]
}
```

## Admin Management APIs

### 1. Get Policies

**Endpoint:** `GET /api/admin/get-policies`

**Description:** Fetch the latest policies and company details pages.

**Authentication:** No Authentication Required

**Request Parameters:** None

**Response (Success):**

```json
{
  "status": true,
  "about_us": {
    "status": "Live",
    "url": "https://www.digivahan.in/about-us"
  },
  "privacy_policy": {
    "status": "Under_Maintenance",
    "url": "https://www.digivahan.in/privacy-policy"
  },
  "data_protection_policy": {
    "status": "Live",
    "url": "https://www.digivahan.in/data-protection-policy"
  },
  "terms_conditions": {
    "status": "Live",
    "url": "https://www.digivahan.in/terms-conditions"
  },
  "refund_policy": {
    "status": "Under_Maintenance",
    "url": "https://www.digivahan.in/refund-policy"
  }
}
```

**Response (Error):**

```json
{
  "status": false,
  "error_type": "other",
  "message": "Server Error"
}
```

### 2. Update Policy Status

**Endpoint:** `PUT /api/admin/update-policy`

**Description:** Update the status of a specific policy (Admin only).

**Authentication:** No Authentication Required

**Request Body:**

```json
{
  "policy_name": "privacy_policy",
  "status": "Live",
  "url": "https://www.digivahan.in/privacy-policy"
}
```

**Response (Success):**

```json
{
  "status": true,
  "message": "Policy updated successfully",
  "policy": {
    "status": "Live",
    "url": "https://www.digivahan.in/privacy-policy"
  }
}
```

### 3. Get Policy Status

**Endpoint:** `GET /api/admin/policy/:policyName`

**Description:** Get the status of a specific policy.

**Authentication:** No Authentication Required

**URL Parameters:**

- **policyName**: Name of the policy (about_us, privacy_policy, data_protection_policy, terms_conditions, refund_policy)

**Response (Success):**

```json
{
  "status": true,
  "policy_name": "privacy_policy",
  "status": "Live",
  "url": "https://www.digivahan.in/privacy-policy"
}
```

## QR Code Management APIs

### 1. Generate QR Code

**Endpoint:** `POST /api/generate-qr`

**Description:** Generate QR codes based on the provided parameters. Accepts a JSON payload containing user-specific information necessary for QR code generation.

**Authentication:** No Authentication Required

**Request Body:**

```json
{
  "generer_id": "user_id",
  "qr_unit": "3",
  "genreated_by": "user"
}
```

**Response (Success):**

```json
{
  "status": true,
  "message": "QR Generated Successfully",
  "qr_list": [
    {
      "qr_image": "https://digivahan.in/api/Qr_cloud_storage/qr_id-4rtrtde43",
      "qr_data": "https://digivahan.in/api/send-notification-page/qr_id-4rtrtde43"
    },
    {
      "qr_image": "https://digivahan.in/api/Qr_cloud_storage/qr_id-4rtrtde43",
      "qr_data": "https://digivahan.in/api/send-notification-page/qr_id-4rtrtde43"
    },
    {
      "qr_image": "https://digivahan.in/api/Qr_cloud_storage/qr_id-4rtrtde43",
      "qr_data": "https://digivahan.in/api/Qr_cloud_storage/qr_id-4rtrtde43"
    }
  ]
}
```

**Response (Error - Invalid Parameter):**

```json
{
  "status": false,
  "error_type": "Invalid parameter",
  "message": "You have entered invalid parameter"
}
```

**Response (Error - Server Issue):**

```json
{
  "status": false,
  "error_type": "other",
  "message": "Server Issue."
}
```

### 2. Get QR Code Details

**Endpoint:** `GET /api/qr/:qrId`

**Description:** Get details of a specific QR code.

**Authentication:** No Authentication Required

**URL Parameters:**

- **qrId**: The unique identifier of the QR code

**Response (Success):**

```json
{
  "status": true,
  "message": "QR Code details retrieved successfully",
  "qr_id": "4rtrtde43",
  "qr_image": "https://digivahan.in/api/Qr_cloud_storage/qr_id-4rtrtde43",
  "qr_data": "https://digivahan.in/api/send-notification-page/qr_id-4rtrtde43",
  "status": "active",
  "created_at": "2025-01-20T10:30:00.000Z"
}
```

### 3. Validate QR Code

**Endpoint:** `POST /api/validate-qr`

**Description:** Validate a QR code and return its data.

**Authentication:** No Authentication Required

**Request Body:**

```json
{
  "qr_data": "https://digivahan.in/api/send-notification-page/qr_id-4rtrtde43"
}
```

**Response (Success):**

```json
{
  "status": true,
  "message": "QR Code validated successfully",
  "qr_data": "https://digivahan.in/api/send-notification-page/qr_id-4rtrtde43",
  "is_valid": true,
  "validated_at": "2025-01-20T10:30:00.000Z"
}
```

### 4. Assign QR Code to Vehicle

**Endpoint:** `POST /api/assign-qr`

**Description:** Assign a QR code to a specific vehicle by providing the necessary details about the vehicle and its owner.

**Authentication:** No Authentication Required

**Request Body:**

```json
{
  "qr_id": "QR00178",
  "vehicle_id": "MH12AB1234",
  "assigend_by": "user",
  "user_id": "507f1f77bcf86cd799439011",
  "sales_id": ""
}
```

**Response (Success):**

```json
{
  "status": true,
  "message": "QR assigned successfully",
  "assigned_qr_id": "QR00178"
}
```

**Response (Error - Invalid QR ID):**

```json
{
  "status": false,
  "error_type": "Invalid id",
  "message": "Invalid QR ID"
}
```

**Response (Error - QR Already Assigned):**

```json
{
  "status": false,
  "error_type": "already_assigned",
  "message": "QR Already Assigend"
}
```

**Response (Error - QR Damaged):**

```json
{
  "status": false,
  "error_type": "damaged",
  "message": "QR is vertually damaged"
}
```

**Response (Error - Vehicle Already Assigned):**

```json
{
  "status": false,
  "error_type": "vehicle_assigned",
  "message": "Vehicle is already connect to a qr code."
}
```

**Response (Error - Invalid Parameter):**

```json
{
  "status": false,
  "error_type": "Invalid parameter",
  "message": "You have entered invalid parameter"
}
```

### 5. Get QR Assignment Details

**Endpoint:** `GET /api/qr-assignment/:qrId`

**Description:** Get details of a QR assignment.

**Authentication:** No Authentication Required

**URL Parameters:**

- **qrId**: The unique identifier of the QR code

**Response (Success):**

```json
{
  "status": true,
  "message": "QR assignment details retrieved successfully",
  "assignment": {
    "qr_id": "QR00178",
    "vehicle_id": "MH12AB1234",
    "assigned_by": "user",
    "user_id": "507f1f77bcf86cd799439011",
    "sales_id": null,
    "status": "active",
    "assigned_at": "2025-01-20T10:30:00.000Z"
  }
}
```

### 6. Get Vehicle QR Assignment

**Endpoint:** `GET /api/vehicle-qr/:vehicleId`

**Description:** Get QR assignment for a specific vehicle.

**Authentication:** No Authentication Required

**URL Parameters:**

- **vehicleId**: The vehicle number/ID

**Response (Success):**

```json
{
  "status": true,
  "message": "Vehicle QR assignment retrieved successfully",
  "assignment": {
    "qr_id": "QR00178",
    "vehicle_id": "MH12AB1234",
    "assigned_by": "user",
    "user_id": "507f1f77bcf86cd799439011",
    "sales_id": null,
    "status": "active",
    "assigned_at": "2025-01-20T10:30:00.000Z"
  }
}
```

## Device Management APIs

### 1. App Keys

**Endpoint:** `POST /api/device/app_keys`

**Description:** Get or update app configuration data including OneSignal ID and app version.

**Authentication:** No Authentication Required

**Request Body (Server hitting):**

```json
{
  "hit_by": "server",
  "one_signal_id": "sdsdscdsdcccsdce",
  "app_version": "1.0.1"
}
```

**Request Body (User hitting):**

```json
{
  "hit_by": "user"
}
```

**Response (Success - Server):**

```json
{
  "status": true,
  "success_type": "server",
  "message": "keys updated success fully"
}
```

**Response (Success - User):**

```json
{
  "status": true,
  "success_type": "user",
  "data": {
    "one_signal_id": "sdsdscdsdcccsdce",
    "app_version": "1.0.1",
    "last_updated": "12/08/2025"
  }
}
```

**Response (Error - Data Not Found):**

```json
{
  "status": false,
  "error_type": "user",
  "message": "Data Not found"
}
```

**Response (Error - Data Not Updated):**

```json
{
  "status": false,
  "error_type": "server",
  "message": "Data not updated."
}
```

### 2. Device Data

**Endpoint:** `POST /api/device/device_data`

**Description:** Add or remove user device information for better user experience.

**Authentication:** No Authentication Required

**Request Body (Add Device):**

```json
{
  "hit_type": "add",
  "user_id": "sddfdsds",
  "device_name": "Oppo",
  "device_version": "Android 14",
  "device_model": "OPPO F1 S",
  "app_version": "0.1",
  "player_id": "StrongPass123",
  "uuid": "dffdssdcdsdfdscs"
}
```

**Request Body (Remove Device):**

```json
{
  "hit_type": "remove",
  "user_id": "sddfdsds",
  "uuid": "dffdssdcdsdfdscs"
}
```

**Response (Success - Add Device):**

```json
{
  "status": true,
  "message": "Device is add in the device list"
}
```

**Response (Success - Remove Device):**

```json
{
  "status": true,
  "message": "Device is removed from the device list"
}
```

**Response (Error - UUID Not Found):**

```json
{
  "status": false,
  "error_type": "other",
  "message": "uudi not found in the list"
}
```

**Response (Error - Invalid Parameter):**

```json
{
  "status": false,
  "error_type": "other",
  "message": "You have entered invalid parameter"
}
```

## Other Endpoints

### Health Check

**Endpoint:** `GET /health`

**Description:** Check if the server is running and database is connected.

**Response:**

```json
{
  "status": "OK",
  "database": "Connected",
  "timestamp": "2025-01-27T10:30:00.000Z"
}
```

### API Status

**Endpoint:** `GET /`

**Description:** Get API status and information.

**Response:**

```json
{
  "message": "DigiVahan Backend API",
  "status": "Server is running",
  "timestamp": "2025-01-27T10:30:00.000Z"
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "status": false,
  "message": "Error description",
  "errors": [
    {
      "field": "field_name",
      "message": "Validation error message",
      "value": "invalid_value"
    }
  ]
}
```

## Validation Rules

### User Registration

- **first_name**: 2-50 characters, letters and spaces only
- **last_name**: 2-50 characters, letters and spaces only
- **email**: Valid email format
- **phone**: Valid mobile phone number
- **password**: Minimum 6 characters, must contain uppercase, lowercase, and number
- **otp_channel**: Must be "EMAIL" or "PHONE" (case-insensitive)
- **api_hit_type**: Optional, when set to "check_user_exists" only checks user existence

### OTP Verification

- **temp_user_id**: 10-50 characters, required
- **otp**: 4-8 numeric characters

### Login

- **login_type**: Must be "email" or "phone"
- **login_value**: Valid email or phone number
- **password**: Minimum 6 characters
- **login_via**: Must be "email" or "phone"
- **value**: Valid email or phone number

### Password Reset

- **identifier**: Valid email or phone number
- **otp_channel**: Must be "email" or "phone" (case-insensitive)
- **new_password**: Minimum 6 characters, must contain uppercase, lowercase, and number

### User Verification

- **medium**: Must be "email" or "phone"
- **value**: Valid email or phone number
- **verificationId**: 6-20 characters (URL parameter)
- **otp**: 4-8 numeric characters

### User Suspension

- **user_id**: Valid MongoDB ObjectId format
- **suspend_until**: Valid ISO 8601 date format, must be in the future
- **reason**: 5-500 characters, required

### Remove User Suspension

- **user_id**: Valid MongoDB ObjectId format, required

### Email Management

- **sender**: Valid registered email address (hr@digivahan.in, info@digivahan.in, etc.), required
- **to**: Valid email address, required
- **subject**: 1-200 characters, required
- **body**: Valid template identifier (termination, welcome, otp), required
- **signature**: Object with dynamic data for template, required
- **attachments**: Array of attachment objects (optional)

### Admin Management

- **policy_name**: Valid policy name (about_us, privacy_policy, data_protection_policy, terms_conditions, refund_policy), required
- **status**: Must be "Live" or "Under_Maintenance", required
- **url**: Valid URL format, optional

### QR Code Management

- **generer_id**: 1-100 characters, required
- **qr_unit**: Valid number between 1-100, required
- **genreated_by**: 1-50 characters, required
- **qr_data**: Valid QR data URL, required for validation

### QR Assignment Management

- **qr_id**: 1-100 characters, required
- **vehicle_id**: 1-50 characters, required
- **assigend_by**: Must be "user" or "sales", required
- **user_id**: Required when assigned_by is "user"
- **sales_id**: Required when assigned_by is "sales"

### App Keys

- **hit_by**: Must be "user" or "server"
- **one_signal_id**: 1-100 characters (optional for server)
- **app_version**: 1-20 characters (optional for server)

### Device Data

- **hit_type**: Must be "add" or "remove"
- **user_id**: 1-100 characters, required
- **uuid**: 10-100 characters, required
- **device_name**: 1-100 characters (optional for add)
- **device_version**: 1-50 characters (optional for add)
- **device_model**: 1-100 characters (optional for add)
- **app_version**: 1-20 characters (optional for add)
- **player_id**: 1-100 characters (optional for add)

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt
2. **OTP Expiry**: OTPs expire after 10 minutes
3. **Rate Limiting**: Maximum 3 OTP attempts per day per contact
4. **JWT Tokens**: Secure authentication tokens
5. **Input Validation**: Comprehensive validation on all inputs
6. **Data Sanitization**: All inputs are trimmed and sanitized
7. **User Suspension**: Time-based user suspension with automatic expiry
8. **Suspension Checks**: All authentication endpoints check for active suspensions
9. **Email Security**: Registered sender validation and template-based email system

## Database Models

### User Model

Complete user profile with:

- Basic details (name, email, phone, password)
- Public details (nickname, address, age, gender)
- Password history
- Live tracking settings
- Notifications
- Orders
- Address book
- Emergency contacts
- Garage with vehicles
- Suspension management (suspended_until, suspension_reason)

### TempUser Model

Temporary user data during OTP verification:

- User details
- OTP information
- Verification status
- Expiry tracking

### OTP Model

OTP tracking and rate limiting:

- Contact information
- OTP code
- Attempt counting
- Daily limits
- Expiry management

### AppKeys Model

App configuration data:

- OneSignal ID for push notifications
- App version information
- Last updated timestamp
- Automatic timestamp management

### DeviceData Model

User device information:

- User ID association
- Device details (name, version, model)
- App version and player ID
- Unique device UUID
- Timestamp tracking

## Email Templates

### Available Templates

1. **termination.html**: Employee termination letter template

   - Variables: `{{employee_name}}`, `{{termination_date}}`
   - Sender info: `{{sender_name}}`, `{{sender_role}}`, `{{sender_email}}`, `{{digital_signature_url}}`

2. **welcome.html**: Employee welcome letter template

   - Variables: `{{employee_name}}`, `{{position}}`, `{{start_date}}`, `{{manager_name}}`
   - Sender info: `{{sender_name}}`, `{{sender_role}}`, `{{sender_email}}`, `{{digital_signature_url}}`

3. **otp.html**: OTP verification email template
   - Variables: `{{user_name}}`, `{{purpose}}`, `{{otp_code}}`, `{{expiry_minutes}}`
   - Sender info: `{{sender_name}}`, `{{sender_role}}`, `{{sender_email}}`, `{{digital_signature_url}}`

### Sender Configuration

Registered sender emails with their configurations:

- **hr@digivahan.in**: HR Team - Human Resource Department
- **info@digivahan.in**: Digivahan Info Team - Information Desk
- **noreply@digivahan.in**: Automated Mailer - System Notifications
- **support@digivahan.in**: Support Team - Customer Support
- **admin@digivahan.in**: Administration - System Administration

## Policies Configuration

### Available Policies

1. **about_us**: Company information and about us page

   - Status: Live/Under_Maintenance
   - URL: Company about page URL

2. **privacy_policy**: Privacy policy and data handling information

   - Status: Live/Under_Maintenance
   - URL: Privacy policy page URL

3. **data_protection_policy**: Data protection and GDPR compliance information

   - Status: Live/Under_Maintenance
   - URL: Data protection policy page URL

4. **terms_conditions**: Terms and conditions of service

   - Status: Live/Under_Maintenance
   - URL: Terms and conditions page URL

5. **refund_policy**: Refund and cancellation policy
   - Status: Live/Under_Maintenance
   - URL: Refund policy page URL

### Policy Statuses

- **Live**: Policy is active and accessible
- **Under_Maintenance**: Policy is temporarily unavailable for updates

## QR Code Generation

### QR Code Features

1. **Unique ID Generation**: Each QR code gets a unique hexadecimal identifier
2. **Batch Generation**: Generate multiple QR codes in a single request
3. **Data Encoding**: QR codes contain structured JSON data with metadata
4. **Cloud Storage URLs**: Generated QR codes reference cloud storage locations
5. **Validation Support**: Built-in QR code validation and verification

### QR Code Data Structure

Each generated QR code contains:

- **qr_id**: Unique identifier for the QR code
- **generer_id**: ID of the user requesting the QR code
- **generated_by**: Identifier of the system/user generating the code
- **timestamp**: ISO timestamp of generation
- **unit_number**: Sequential number within the batch
- **total_units**: Total number of QR codes in the batch

### QR Code URLs

- **Image URL**: `https://digivahan.in/api/Qr_cloud_storage/qr_id-{unique_id}`
- **Data URL**: `https://digivahan.in/api/send-notification-page/qr_id-{unique_id}`

## QR Assignment System

### Assignment Process

1. **QR Validation**: Check if QR ID is valid and not already assigned
2. **Structure Validation**: Verify QR has proper structure (not damaged)
3. **Vehicle Check**: Ensure vehicle is not already connected to another QR
4. **User/Sales Validation**: Validate user_id or sales_id based on assignment type
5. **Assignment Creation**: Create QR assignment record
6. **Vehicle Update**: Update vehicle details in user's garage (if user assignment)

### Assignment Types

- **User Assignment**: User assigns QR to their own vehicle

  - Requires: `user_id` and valid user account
  - Updates: User's garage vehicle with QR details

- **Sales Assignment**: Sales person assigns QR to customer's vehicle
  - Requires: `sales_id` for tracking
  - Updates: QR assignment record only

### Assignment Status

- **active**: QR is properly assigned and functional
- **damaged**: QR is virtually damaged (structure issues)
- **inactive**: QR assignment is deactivated

### Database Models

#### QRAssignment Model

- **qr_id**: Unique QR identifier
- **vehicle_id**: Vehicle number/ID
- **assigned_by**: Assignment type (user/sales)
- **user_id**: User ID (if user assignment)
- **sales_id**: Sales ID (if sales assignment)
- **status**: Assignment status
- **assigned_at**: Assignment timestamp
- **vehicle_details**: Vehicle information
- **qr_details**: QR code information

## Environment Variables

Create a `.env` file with:

```env
# Database Configuration
DB_URL=mongodb://localhost:27017/digivahan

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=3000
NODE_ENV=development

# Vercel Configuration (for deployment)
VERCEL=0

# Email Configuration (AWS SES)
SES_SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SES_SMTP_PORT=587
SES_SMTP_USER=your-ses-smtp-username
SES_SMTP_PASS=your-ses-smtp-password

# Email Configuration (for OTP sending)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# SMS Configuration (for OTP sending)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Redis Configuration (optional, for caching)
REDIS_URL=redis://localhost:6379
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the server:

```bash
npm run dev
```

4. Test the API:

```bash
# Test health check
curl http://localhost:3000/health

# Test registration init
curl -X POST http://localhost:3000/api/auth/register/init \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Mustafa",
    "last_name": "Hasan",
    "email": "mustafa@email.com",
    "phone": "9876543210",
    "password": "StrongPass123",
    "otp_channel": "phone"
  }'
```

## Deployment

### Vercel Deployment

This project is configured for Vercel serverless deployment:

1. **Install Vercel CLI:**

   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel:**

   ```bash
   vercel
   ```

3. **Environment Variables:**
   Set the following environment variables in your Vercel dashboard:

   - `DB_URL`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS`: Email configuration
   - `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`: SMS configuration

4. **Production URL:**
   Your API will be available at: `https://your-project.vercel.app`

### Local Development vs Production

- **Local**: Uses `npm run dev` with nodemon for auto-restart
- **Production**: Uses `npm start` with Node.js
- **Vercel**: Automatically detects and uses the serverless function format

## Dependencies

The project uses the following key dependencies:

```json
{
  "dependencies": {
    "axios": "^1.12.2",
    "bcryptjs": "^3.0.2",
    "cors": "^2.8.5",
    "dotenv": "^17.2.2",
    "express": "^5.1.0",
    "express-validator": "^7.2.1",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.18.1",
    "nodemailer": "^7.0.6",
    "nodemon": "^3.1.10",
    "redis": "^5.8.2",
    "twilio": "^5.10.0"
  }
}
```

### Key Features

- **Express.js**: Web framework for Node.js
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Token authentication
- **bcryptjs**: Password hashing
- **express-validator**: Input validation middleware
- **nodemailer**: Email sending capabilities
- **twilio**: SMS sending capabilities
- **redis**: Caching and session storage
- **cors**: Cross-origin resource sharing

## Notes

- OTPs are currently logged to console (mock implementation)
- In production, integrate with actual SMS/Email services using Twilio and Nodemailer
- All timestamps are in ISO format
- User passwords are never returned in API responses
- JWT tokens expire after 7 days
- The application supports both local development and Vercel serverless deployment
- Database connection is handled gracefully for serverless environments
