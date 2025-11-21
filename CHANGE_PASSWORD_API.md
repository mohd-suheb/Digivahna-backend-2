# Change Password API Documentation

## Overview
The Change Password API allows users to securely change their account password. It requires the user to provide their current password and the new password they wish to set. The API validates the old password first and ensures the new password meets security requirements.

## Features
- 🌟 **Secure Password Change**: Change password with current password verification
- ✨ **Password History**: Prevents reuse of previous passwords
- 🔄 **Password Strength Validation**: Ensures strong password requirements
- 🛡️ **Account Security**: Validates current password before change
- 📊 **Password History Tracking**: Maintains history of previous passwords

## API Endpoints

### 1. Change User Password
**Endpoint**: `POST /api/v1/user/change-password`  
**Authentication**: No authentication required (as per requirements)  
**Description**: Change user password with current password verification

#### Request Parameters

**Required Parameters:**
- `user_id` (string): The unique identifier for the user (email or phone number)
- `old_password` (string): Current password of the user
- `new_password` (string): New password to set (must not be one of previous passwords)

#### Request Example
```json
{
  "user_id": "user@example.com",
  "old_password": "OldPass@123",
  "new_password": "NewSecret@456"
}
```

#### Response Examples

**Success - Password Changed**
```json
{
  "status": true,
  "message": "Password has been successfully updated."
}
```

**Error - Invalid Current Password**
```json
{
  "status": false,
  "error_type": "password",
  "message": "The current password is not matching"
}
```

**Error - Same Password**
```json
{
  "status": false,
  "error_type": "password",
  "message": "The password you want to set is similar to your old password."
}
```

**Error - Invalid Parameters**
```json
{
  "status": false,
  "error_type": "other",
  "message": "Invalid parameter"
}
```

**Error - Password Too Short**
```json
{
  "status": false,
  "error_type": "password",
  "message": "Password must be at least 6 characters long"
}
```

**Error - Old Password Reuse**
```json
{
  "status": false,
  "error_type": "password",
  "message": "Password cannot be one of your previous passwords"
}
```

### 2. Get Password History
**Endpoint**: `GET /api/v1/user/:user_id/password-history`  
**Authentication**: No authentication required  
**Description**: Get password change history and requirements

#### Response
```json
{
  "status": true,
  "message": "Password history retrieved successfully",
  "data": {
    "total_old_passwords": 3,
    "last_password_change": "2025-01-16T10:00:00Z",
    "password_strength": {
      "min_length": 6,
      "requires_uppercase": true,
      "requires_lowercase": true,
      "requires_number": true,
      "requires_special_char": false
    }
  }
}
```

### 3. Check Password Strength
**Endpoint**: `POST /api/v1/user/check-password-strength`  
**Authentication**: No authentication required  
**Description**: Check password strength without changing password

#### Request Parameters
- `password` (string): Password to check

#### Request Example
```json
{
  "password": "NewSecret@456"
}
```

#### Response
```json
{
  "status": true,
  "message": "Password strength checked successfully",
  "data": {
    "is_valid": true,
    "errors": [],
    "strength_score": 85
  }
}
```

## Business Logic

### Password Change Flow
1. **Validation**: Validate all required fields
2. **Password Strength**: Check new password meets requirements
3. **Same Password Check**: Ensure new password is different from old
4. **User Lookup**: Find user by email or phone
5. **Current Password Verification**: Verify current password matches
6. **Old Password Check**: Ensure new password is not in history
7. **Password Hashing**: Hash new password with salt
8. **History Update**: Add current password to old passwords list
9. **Database Update**: Update user password
10. **Response**: Return success message

### Password History Management
- **History Storage**: Stores up to 4 previous passwords
- **Password Rotation**: Shifts passwords down the list when adding new
- **Reuse Prevention**: Prevents reuse of any previous password
- **Secure Storage**: All passwords stored as hashed values

### Password Strength Requirements
- **Minimum Length**: 6 characters
- **Uppercase Letter**: At least one uppercase letter
- **Lowercase Letter**: At least one lowercase letter
- **Number**: At least one number
- **Special Characters**: Optional (not required)

## Security Features

### Password Security
1. **Current Password Verification**: Must provide correct current password
2. **Password Hashing**: Uses bcrypt with salt for secure storage
3. **History Prevention**: Cannot reuse previous passwords
4. **Strength Validation**: Enforces strong password requirements
5. **Secure Comparison**: Uses bcrypt.compare for password verification

### Validation Rules
- **User ID**: Valid email or phone number
- **Old Password**: Required, 1-128 characters
- **New Password**: Required, 6-128 characters, must meet strength requirements
- **Password Difference**: New password must be different from old password
- **History Check**: New password cannot be in previous passwords list

## Error Handling

### Validation Errors
- Missing required fields
- Invalid user_id format
- Password too short
- Password doesn't meet strength requirements
- New password same as old password

### Business Logic Errors
- User not found
- Invalid current password
- Password in history
- Account deleted or inactive

### Server Errors
- Database connection issues
- Password hashing failures
- Internal processing errors

## Database Schema

### User Model - Password Fields
```javascript
basic_details: {
  password: String,           // Current hashed password
  // ... other fields
},
old_passwords: {
  previous_password1: String, // Most recent old password (hashed)
  previous_password2: String, // Second most recent (hashed)
  previous_password3: String, // Third most recent (hashed)
  previous_password4: String  // Oldest stored password (hashed)
}
```

### Password History Rotation
When a new password is set:
1. `previous_password4` = `previous_password3`
2. `previous_password3` = `previous_password2`
3. `previous_password2` = `previous_password1`
4. `previous_password1` = current password (before change)
5. `password` = new password (hashed)

## Testing

### Test Cases
1. **Valid Password Change**: Test with valid current and new password
2. **Invalid Current Password**: Test with wrong current password
3. **Same Password**: Test with new password same as old
4. **Weak Password**: Test with password that doesn't meet requirements
5. **Old Password Reuse**: Test with password from history
6. **User Not Found**: Test with non-existent user
7. **Password History**: Test password history retrieval
8. **Password Strength**: Test password strength checking

### Sample Test Data
```json
{
  "user_id": "test@example.com",
  "old_password": "OldPass@123",
  "new_password": "NewSecret@456"
}
```

## Integration Notes

### Password Hashing
- Uses bcrypt with salt rounds (10)
- Consistent with existing password hashing
- Secure password comparison methods

### Database Integration
- Updates existing User model
- Maintains password history
- Preserves existing relationships

### Security Integration
- Follows existing security patterns
- Maintains password security standards
- Consistent error handling

## Performance Considerations

1. **Password Hashing**: Efficient bcrypt hashing with appropriate salt rounds
2. **Database Queries**: Optimized user lookup and updates
3. **History Comparison**: Efficient comparison of password history
4. **Validation Efficiency**: Early validation to prevent unnecessary processing

## Password Strength Scoring

### Strength Score Calculation (0-100)
- **Length Score (0-40 points)**:
  - 6+ characters: 10 points
  - 8+ characters: 10 points
  - 12+ characters: 10 points
  - 16+ characters: 10 points

- **Character Variety Score (0-60 points)**:
  - Lowercase letter: 15 points
  - Uppercase letter: 15 points
  - Number: 15 points
  - Special character: 15 points

### Strength Levels
- **0-30**: Weak
- **31-60**: Fair
- **61-80**: Good
- **81-100**: Strong

## Future Enhancements

1. **Advanced Password Policies**: Configurable password requirements
2. **Password Expiry**: Optional password expiration
3. **Two-Factor Authentication**: Additional security layer
4. **Password Reset**: Forgot password functionality
5. **Account Lockout**: Lock account after failed attempts
6. **Password Audit**: Track password change history
7. **Custom Requirements**: User-specific password requirements
8. **Password Manager Integration**: Support for password managers

## Security Best Practices

### Password Requirements
- Minimum 6 characters
- Mix of uppercase, lowercase, and numbers
- No reuse of previous 4 passwords
- Secure hashing with bcrypt

### Account Security
- Current password verification required
- Password history tracking
- Secure password comparison
- Protection against common attacks

### Data Protection
- Passwords never stored in plain text
- Secure password hashing
- History rotation for security
- No password logging

## Monitoring and Logging

### Key Metrics
- Password change requests
- Failed password attempts
- Password strength distribution
- Password history usage

### Log Messages
- Password change attempts
- Failed password verifications
- Password strength checks
- Security events
- Error conditions

### Security Monitoring
- Track failed password attempts
- Monitor password strength trends
- Alert on suspicious activity
- Log security events
