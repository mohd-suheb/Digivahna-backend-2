# Update User API Documentation

## Overview
The Update User API allows users to update their profile details including basic information and public details. The API supports both text field updates and file uploads for profile and public images.

## Features
- 🌟 **Flexible Updates**: Update basic or public details separately or together
- ✨ **File Upload Support**: Upload profile and public images
- 🔄 **Profile Completion**: Automatic calculation of profile completion percentage
- 🛡️ **Data Validation**: Comprehensive validation for all fields
- 📊 **Conflict Prevention**: Check for email/phone conflicts with other users

## API Endpoints

### 1. Update User Details
**Endpoint**: `POST /api/update_user`  
**Authentication**: Basic auth (as per requirements)  
**Description**: Updates user profile details including basic and public information

#### Request Parameters

**Required Parameters:**
- `user_id` (text): The unique identifier for the user (email or phone number)

**Optional Parameters:**
- `update_details` (text): Type of details being updated ("basic_details" or "public_details")
- `first_name` (text): User's first name
- `last_name` (text): User's last name
- `email` (text): User's email address
- `phone_number` (text): User's phone number
- `occupation` (text): User's occupation
- `profile_image` (file): User's profile image
- `public_image` (file): Public display image
- `nick_name` (text): User's nickname
- `address` (text): User's address
- `age` (text): User's age
- `gender` (text): User's gender

#### Request Examples

**Update Basic Details Only**
```json
{
  "user_id": "user@example.com",
  "update_details": "basic_details",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "occupation": "Software Engineer"
}
```

**Update Public Details Only**
```json
{
  "user_id": "user@example.com",
  "update_details": "public_details",
  "nick_name": "Johnny",
  "address": "123 Main St, City, State",
  "age": "30",
  "gender": "male"
}
```

**Update All Details**
```json
{
  "user_id": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone_number": "9876543210",
  "occupation": "Software Engineer",
  "nick_name": "Johnny",
  "address": "123 Main St, City, State",
  "age": "30",
  "gender": "male"
}
```

**With File Uploads**
```javascript
// FormData with files
const formData = new FormData();
formData.append('user_id', 'user@example.com');
formData.append('first_name', 'John');
formData.append('last_name', 'Doe');
formData.append('profile_image', profileImageFile);
formData.append('public_image', publicImageFile);
```

#### Response Examples

**Success Response**
```json
{
  "status": true,
  "message": "updated successful",
  "user": {
    "basic_details": {
      "profile_pic_url": "https://s3.amazonaws.com/bucket/profile-images/user123.jpg",
      "first_name": "John",
      "last_name": "Doe",
      "phone_number": "9876543210",
      "phone_number_verified": false,
      "is_phone_number_primary": true,
      "email": "john.doe@example.com",
      "is_email_verified": false,
      "is_email_primary": true,
      "password": "",
      "occupation": "Software Engineer",
      "profile_completion_percent": 85
    },
    "public_details": {
      "public_pic_url": "https://s3.amazonaws.com/bucket/public-images/user123.jpg",
      "nick_name": "Johnny",
      "address": "123 Main St, City, State",
      "age": 30,
      "gender": "male"
    }
  }
}
```

**Error - User Not Found**
```json
{
  "status": false,
  "error_type": "user_id",
  "message": "User does not exist"
}
```

**Error - Email Already Exists**
```json
{
  "status": false,
  "error_type": "email",
  "message": "This email is already registered"
}
```

**Error - Phone Already Exists**
```json
{
  "status": false,
  "error_type": "phone",
  "message": "This phone number is already registered"
}
```

**Error - Invalid Parameters**
```json
{
  "status": false,
  "error_type": "validation",
  "message": "You have entered invalid parameter"
}
```

**Error - Server Issue**
```json
{
  "status": false,
  "error_type": "other",
  "message": "Server Issue."
}
```

### 2. Get User Details
**Endpoint**: `GET /api/get_user_details/:user_id`  
**Authentication**: Basic auth  
**Description**: Retrieves current user details

#### Response
```json
{
  "status": true,
  "message": "User details retrieved successfully",
  "user": {
    "basic_details": {
      "profile_pic_url": "https://s3.amazonaws.com/bucket/profile-images/user123.jpg",
      "first_name": "John",
      "last_name": "Doe",
      "phone_number": "9876543210",
      "phone_number_verified": true,
      "is_phone_number_primary": true,
      "email": "john.doe@example.com",
      "is_email_verified": true,
      "is_email_primary": false,
      "password": "",
      "occupation": "Software Engineer",
      "profile_completion_percent": 85
    },
    "public_details": {
      "public_pic_url": "https://s3.amazonaws.com/bucket/public-images/user123.jpg",
      "nick_name": "Johnny",
      "address": "123 Main St, City, State",
      "age": 30,
      "gender": "male"
    }
  }
}
```

## Field Validation Rules

### Basic Details
- **first_name**: 2-50 characters, letters and spaces only
- **last_name**: 2-50 characters, letters and spaces only
- **email**: Valid email format, normalized to lowercase
- **phone_number**: Exactly 10 digits
- **occupation**: 1-100 characters
- **profile_image**: Image file (JPEG, PNG, GIF, WebP), max 5MB

### Public Details
- **nick_name**: 1-50 characters
- **address**: 1-500 characters
- **age**: Integer between 1-150
- **gender**: One of: "male", "female", "other", or empty string
- **public_image**: Image file (JPEG, PNG, GIF, WebP), max 5MB

## Business Logic

### Update Process
1. **Validation**: Validate user_id and all provided fields
2. **User Lookup**: Find user by email or phone number
3. **Conflict Check**: Verify email/phone not taken by other users
4. **File Upload**: Process image uploads to S3
5. **Data Update**: Update user record with new values
6. **Completion Calculation**: Recalculate profile completion percentage
7. **Response**: Return updated user data

### Profile Completion Calculation
The system automatically calculates profile completion percentage based on filled fields:

**Basic Details (6 fields):**
- first_name
- last_name
- phone_number
- email
- occupation
- profile_pic_url

**Public Details (5 fields):**
- nick_name
- address
- age
- gender
- public_pic_url

**Formula**: (Filled Fields / Total Fields) × 100

### Email/Phone Verification Reset
When email or phone number is updated:
- Verification status is reset to `false`
- User needs to verify the new contact information

### File Upload Handling
- Images are uploaded to AWS S3
- Profile images stored in `profile-images` folder
- Public images stored in `public-images` folder
- File size limit: 5MB
- Supported formats: JPEG, PNG, GIF, WebP

## Error Handling

### Validation Errors
- Missing required fields
- Invalid field formats
- Field length violations
- Invalid file types

### Business Logic Errors
- User not found
- Email/phone already exists
- User account deleted
- File upload failures

### Server Errors
- Database connection issues
- S3 upload failures
- Internal processing errors

## Security Considerations

1. **Input Validation**: Comprehensive validation on all inputs
2. **File Upload Security**: File type and size restrictions
3. **Data Sanitization**: Trim whitespace and normalize data
4. **Conflict Prevention**: Check for duplicate email/phone
5. **Password Protection**: Never return password in responses
6. **User Verification**: Reset verification status on contact changes

## Testing

### Test Cases
1. **Valid Updates**: Test with valid parameters
2. **Partial Updates**: Test updating only specific fields
3. **File Uploads**: Test image upload functionality
4. **Validation Errors**: Test with invalid inputs
5. **Conflict Detection**: Test duplicate email/phone
6. **User Not Found**: Test with non-existent user
7. **Profile Completion**: Verify completion percentage calculation

### Sample Test Data
```json
{
  "user_id": "test@example.com",
  "first_name": "Test",
  "last_name": "User",
  "email": "test.user@example.com",
  "phone_number": "9876543210",
  "occupation": "Tester",
  "nick_name": "TestUser",
  "address": "Test Address",
  "age": "25",
  "gender": "other"
}
```

## Integration Notes

### File Upload Integration
The API integrates with the existing S3 upload utilities:
- Uses `configureMulterS3` for file handling
- Leverages `uploadSingleFile` for S3 uploads
- Maintains consistency with other file upload endpoints

### Database Integration
- Updates existing User model
- Maintains data integrity
- Preserves existing relationships
- Updates timestamps automatically

### Authentication Integration
- Compatible with existing auth middleware
- Supports basic authentication as specified
- Maintains user session integrity

## Performance Considerations

1. **File Upload Optimization**: Efficient S3 upload handling
2. **Database Queries**: Optimized user lookup and updates
3. **Validation Efficiency**: Early validation to prevent unnecessary processing
4. **Response Optimization**: Minimal data transfer in responses

## Future Enhancements

1. **Bulk Updates**: Support for updating multiple users
2. **Image Processing**: Automatic image resizing and optimization
3. **Audit Trail**: Track all profile changes
4. **Notification System**: Notify users of profile updates
5. **Advanced Validation**: More sophisticated field validation rules
6. **Profile Templates**: Predefined profile templates for different user types
