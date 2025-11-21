# DigiVahan API Postman Collection

This repository contains a comprehensive Postman collection for testing all the DigiVahan Backend APIs.

## 📁 Files Included

- `DigiVahan_API_Collection.postman_collection.json` - Complete API collection
- `DigiVahan_Environment.postman_environment.json` - Environment variables
- `POSTMAN_COLLECTION_README.md` - This documentation

## 🚀 Quick Start

### 1. Import Collection and Environment

1. Open Postman
2. Click **Import** button
3. Import both files:
   - `DigiVahan_API_Collection.postman_collection.json`
   - `DigiVahan_Environment.postman_environment.json`

### 2. Set Up Environment

1. Select the **DigiVahan Environment** from the environment dropdown
2. Update the `base_url` variable if your server is running on a different port
3. For production testing, switch to `base_url_production` and update the URL

### 3. Start Testing

1. Make sure your DigiVahan backend server is running
2. Start with the **Health & Status** folder to verify server connectivity
3. Follow the **Test Scenarios** for complete flow testing

## 📋 Collection Structure

### Health & Status
- **API Status** - Get basic API information
- **Health Check** - Verify server and database status

### Authentication APIs
- **Registration Flow**
  - Check User Exists
  - Register User (with OTP)
  - Verify OTP
  - Resend OTP
- **Login Flow**
  - Sign In (Email/Phone + Password)
  - OTP Based Login
  - Verify Login OTP
- **Password Reset Flow**
  - Request Reset Password
  - Verify Reset OTP
- **User Verification Flow**
  - Request Verification
  - Confirm Verification

### Device Management APIs
- **App Keys**
  - Server Update (update OneSignal ID, app version)
  - User Get (retrieve app configuration)
- **Device Data**
  - Add Device (iPhone, Android examples)
  - Remove Device

### Test Scenarios
- **Complete Registration Flow** - End-to-end registration testing
- **Complete Login Flow** - End-to-end login testing
- **Complete Password Reset Flow** - End-to-end password reset
- **Complete Device Management Flow** - End-to-end device management

## 🔧 Environment Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `base_url` | Local development URL | `http://localhost:3000` |
| `base_url_production` | Production URL | `https://your-project.vercel.app` |
| `user_id` | User ID (auto-extracted) | `507f1f77bcf86cd799439011` |
| `temp_user_id` | Temp user ID (auto-extracted) | `temp-1640995200000` |
| `verification_id` | Verification ID (auto-extracted) | `verify-1640995200000` |
| `jwt_token` | JWT token (auto-extracted) | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `test_email` | Test email | `test@example.com` |
| `test_phone` | Test phone | `9876543210` |
| `test_password` | Test password | `TestPass123` |
| `test_otp` | Test OTP | `123456` |

## 🎯 Key Features

### Auto-Extraction of Variables
The collection automatically extracts and sets the following variables from API responses:
- `user_id` - From successful registration/login
- `temp_user_id` - From registration init response
- `verification_id` - From verification request response
- `jwt_token` - From authentication responses

### Pre-request Scripts
- Auto-generates test data when needed
- Sets up default values for testing

### Test Scripts
- Validates response status codes
- Extracts important data from responses
- Sets up variables for subsequent requests

## 📝 Testing Workflows

### 1. Complete User Registration
```
1. Check User Exists
2. Register User (hit_type: "register")
3. Verify OTP
4. Add Device
5. Get App Keys
```

### 2. Complete Login Flow
```
1. OTP Based Login
2. Verify Login OTP
3. Add Device (if needed)
```

### 3. Password Reset Flow
```
1. Request Reset Password
2. Verify Reset OTP
3. Login with New Password
```

### 4. Device Management
```
1. Update App Keys (Server)
2. Get App Keys (User)
3. Add Device
4. Remove Device
```

## 🔍 API Endpoints Covered

### Authentication Endpoints
- `POST /api/auth/register/init` - User registration initiation
- `POST /api/auth/register/verify-otp` - OTP verification
- `POST /api/auth/register/resend-otp` - Resend OTP
- `POST /api/auth/sign-in` - User sign in
- `POST /api/auth/otp-based-login` - OTP-based login
- `POST /api/auth/verify-login-otp` - Verify login OTP
- `POST /api/auth/request-reset-password` - Request password reset
- `POST /api/auth/verify-reset-otp` - Verify reset OTP
- `POST /api/auth/user/verify/request` - Request user verification
- `POST /api/auth/user/verify/confirm/:verificationId` - Confirm verification

### Device Management Endpoints
- `POST /api/device/app_keys` - App configuration management
- `POST /api/device/device_data` - Device data management

### Health Endpoints
- `GET /` - API status
- `GET /health` - Health check

## 🛠️ Customization

### Adding New Test Cases
1. Duplicate existing requests
2. Modify the request body/path as needed
3. Update the test scripts if required
4. Add to appropriate folder

### Modifying Environment Variables
1. Edit the environment file
2. Add new variables as needed
3. Update pre-request scripts if required

### Adding New Environments
1. Create new environment file
2. Set appropriate base URLs
3. Configure environment-specific variables

## 🚨 Important Notes

### OTP Testing
- The collection uses `123456` as test OTP
- In development, OTPs are logged to console
- For production testing, use actual OTPs received

### Database State
- Some tests may affect database state
- Consider using test database for extensive testing
- Clean up test data after testing

### Rate Limiting
- OTP endpoints have daily limits (3 per day per contact)
- Use different phone numbers/emails for extensive testing
- Wait 24 hours or reset database for rate limit testing

## 🔧 Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure server is running on correct port
   - Check `base_url` environment variable

2. **Validation Errors**
   - Check request body format
   - Verify required fields are present
   - Check field length limits

3. **OTP Not Working**
   - Check server logs for OTP generation
   - Verify OTP channel configuration
   - Check rate limiting

4. **Variable Not Set**
   - Check test scripts in previous requests
   - Verify response format matches expectations
   - Check environment variable names

### Debug Tips

1. Enable Postman Console to see detailed logs
2. Check server logs for backend errors
3. Verify database connection
4. Test individual requests before running collections

## 📞 Support

For issues with the API collection:
1. Check this README first
2. Verify server is running correctly
3. Check environment variables
4. Review server logs

For API-related issues, refer to the main API documentation in `API_DOCUMENTATION.md`.

## 🎉 Happy Testing!

This collection provides comprehensive coverage of all DigiVahan APIs. Use the test scenarios for end-to-end testing and individual requests for specific functionality testing.
