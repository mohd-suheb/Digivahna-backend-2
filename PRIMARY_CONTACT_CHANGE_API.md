# Primary Contact Change API Documentation

## Overview
The Primary Contact Change API allows users to securely change their primary contact method (email or phone) with OTP verification. The OTP is always sent to the currently verified primary contact, not the one being set as primary, ensuring account security.

## Features
- 🌟 **Secure Primary Contact Change**: Change primary contact with OTP verification
- ✨ **OTP to Current Primary**: OTP sent to current primary contact for security
- 🔄 **Verification Required**: Target contact must be verified before change
- 🛡️ **Account Security**: Prevents unauthorized primary contact changes
- 📊 **Status Tracking**: Track primary contact status and pending changes

## API Endpoints

### 1. Request Primary Contact Change
**Endpoint**: `POST /api/v1/user/change-primary-contact-request`  
**Authentication**: No authentication required (as per requirements)  
**Description**: Request to change primary contact method with OTP verification

#### Request Parameters

**Required Parameters:**
- `user_id` (string): The unique identifier for the user (email or phone number)
- `set_primary` (enum): Target primary contact - "mobile", "email", or "phone"

#### Request Examples

**Set Email as Primary**
```json
{
  "user_id": "user@example.com",
  "set_primary": "email"
}
```

**Set Phone as Primary**
```json
{
  "user_id": "user@example.com",
  "set_primary": "phone"
}
```

**Set Mobile as Primary (alias for phone)**
```json
{
  "user_id": "user@example.com",
  "set_primary": "mobile"
}
```

#### Response Examples

**Success - OTP Sent to Email**
```json
{
  "status": true,
  "success_type": "otp_sent",
  "message": "OTP Sent successfully on xyz@gmail.com",
  "verification_endpoint": "https://digivahan.in/api/v1/user/change-primary-contact-verification"
}
```

**Success - OTP Sent to Phone**
```json
{
  "status": true,
  "success_type": "otp_sent",
  "message": "OTP Sent successfully on 8279861939",
  "verification_endpoint": "https://digivahan.in/api/v1/user/change-primary-contact-verification"
}
```

**Error - Already Primary**
```json
{
  "status": false,
  "error_type": "primary",
  "message": "The selected account is already primary"
}
```

**Error - Email Not Verified**
```json
{
  "status": false,
  "error_type": "email",
  "message": "This email is not verified."
}
```

**Error - Phone Not Verified**
```json
{
  "status": false,
  "error_type": "phone",
  "message": "This phone number is not verified"
}
```

**Error - Invalid Parameters**
```json
{
  "status": false,
  "error_type": "other",
  "message": "You have entered invalid parameter"
}
```

### 2. Verify Primary Contact Change
**Endpoint**: `POST /api/v1/user/change-primary-contact-verification`  
**Authentication**: No authentication required  
**Description**: Verify OTP and complete primary contact change

#### Request Parameters

**Required Parameters:**
- `user_id` (string): The unique identifier for the user
- `otp` (string): The OTP received on current primary contact

#### Request Example
```json
{
  "user_id": "user@example.com",
  "otp": "14365"
}
```

#### Response Examples

**Success - Email Set as Primary**
```json
{
  "status": true,
  "message": "Email has been set as primary"
}
```

**Success - Phone Set as Primary**
```json
{
  "status": true,
  "message": "Phone has been set as primary"
}
```

**Error - Invalid OTP**
```json
{
  "status": false,
  "error_type": "otp",
  "message": "Invalid or expired OTP"
}
```

**Error - Invalid Parameters**
```json
{
  "status": false,
  "error_type": "other",
  "message": "You have entered invalid parameter"
}
```

### 3. Get Primary Contact Status
**Endpoint**: `GET /api/v1/user/:user_id/primary-contact-status`  
**Authentication**: No authentication required  
**Description**: Get current primary contact status and verification details

#### Response
```json
{
  "status": true,
  "message": "Primary contact status retrieved successfully",
  "data": {
    "email": {
      "address": "user@example.com",
      "is_primary": false,
      "is_verified": true
    },
    "phone": {
      "number": "9876543210",
      "is_primary": true,
      "is_verified": true
    },
    "pending_change": {
      "target_primary": "email",
      "requested_at": "2025-01-16T10:00:00Z"
    }
  }
}
```

## Business Logic

### Request Primary Contact Change Flow
1. **Validation**: Validate user_id and set_primary parameters
2. **User Lookup**: Find user by email or phone
3. **Primary Check**: Verify target contact is not already primary
4. **Verification Check**: Ensure target contact is verified
5. **Current Primary Detection**: Identify current primary contact
6. **OTP Generation**: Generate OTP and verification ID
7. **OTP Storage**: Store OTP record with expiry
8. **Request Storage**: Store change request in user document
9. **OTP Sending**: Send OTP to current primary contact
10. **Response**: Return success with verification endpoint

### Verification Flow
1. **Validation**: Validate user_id and OTP
2. **User Lookup**: Find user and pending change request
3. **OTP Verification**: Verify OTP against stored record
4. **Expiry Check**: Ensure OTP is not expired
5. **Primary Update**: Update primary contact flags
6. **Request Cleanup**: Clear pending change request
7. **OTP Marking**: Mark OTP as used
8. **Response**: Return success message

### OTP Logic Matrix

| Current Primary | Target Primary | OTP Sent To | Conditions |
|----------------|----------------|-------------|------------|
| Mobile Number  | Email          | Mobile      | Email must be verified |
| Mobile Number  | Mobile         | Mobile      | Already primary (error) |
| Email          | Mobile         | Email       | Mobile must be verified |
| Email          | Email          | Email       | Already primary (error) |

## Security Features

### Safety Points
1. **Verification Requirement**: Target contact must be verified before change
2. **OTP to Current Primary**: OTP always sent to current primary contact
3. **OTP Expiry**: OTP expires after 10 minutes
4. **Single Use**: OTP can only be used once
5. **Rate Limiting**: Built-in OTP attempt limits
6. **Request Tracking**: Pending requests are tracked and validated

### Validation Rules
- **User ID**: Valid email or phone number
- **Set Primary**: Must be "mobile", "email", or "phone"
- **OTP**: 4-8 digits, numeric only
- **Verification**: Target contact must be verified
- **Primary Check**: Target cannot already be primary

## Error Handling

### Validation Errors
- Missing required fields
- Invalid user_id format
- Invalid set_primary value
- Invalid OTP format

### Business Logic Errors
- User not found
- Target contact already primary
- Target contact not verified
- No pending change request
- Invalid or expired OTP

### Server Errors
- Database connection issues
- OTP sending failures
- Internal processing errors

## Database Schema

### User Model Updates
```javascript
// New field in User model
primary_contact_change_request: {
  verification_id: String,    // Unique verification ID
  target_primary: String,     // Target primary contact type
  current_primary: String,    // Current primary contact type
  requested_at: Date         // Request timestamp
}
```

### OTP Model Usage
```javascript
// Existing OTP model fields used
{
  contact: String,           // Current primary contact
  otp_code: String,          // Generated OTP
  otp_channel: String,       // EMAIL or PHONE
  verification_id: String,   // Unique verification ID
  expires_at: Date,          // OTP expiry (10 minutes)
  is_used: Boolean          // Single use flag
}
```

## Testing

### Test Cases
1. **Valid Request**: Test with valid parameters
2. **Already Primary**: Test setting already primary contact
3. **Unverified Contact**: Test with unverified target contact
4. **OTP Verification**: Test OTP verification flow
5. **Invalid OTP**: Test with wrong OTP
6. **Expired OTP**: Test with expired OTP
7. **No Pending Request**: Test verification without pending request
8. **Status Check**: Test primary contact status retrieval

### Sample Test Data
```json
{
  "user_id": "test@example.com",
  "set_primary": "phone"
}
```

## Integration Notes

### OTP Integration
- Uses existing OTP model and utilities
- Leverages existing OTP sending mechanisms
- Maintains consistency with other OTP flows

### Database Integration
- Updates existing User model
- Maintains data integrity
- Preserves existing relationships

### Security Integration
- Follows existing security patterns
- Maintains OTP security standards
- Consistent error handling

## Performance Considerations

1. **OTP Generation**: Efficient OTP generation and storage
2. **Database Queries**: Optimized user lookup and updates
3. **Validation Efficiency**: Early validation to prevent unnecessary processing
4. **Response Optimization**: Minimal data transfer in responses

## Future Enhancements

1. **SMS Integration**: Enhanced SMS delivery options
2. **Email Templates**: Customized email templates for OTP
3. **Audit Trail**: Track all primary contact changes
4. **Notification System**: Notify users of primary contact changes
5. **Backup Contacts**: Support for backup contact methods
6. **Advanced Security**: Additional security measures (2FA, etc.)
7. **Change History**: Track primary contact change history
8. **Bulk Operations**: Support for multiple contact management

## Rate Limiting and Security

### OTP Security
- **Expiry Time**: 10 minutes
- **Single Use**: OTP can only be used once
- **Attempt Limits**: Built-in attempt tracking
- **Rate Limiting**: Prevents OTP spam

### Account Security
- **Verification Required**: Target must be verified
- **Current Primary OTP**: OTP sent to current primary only
- **Request Tracking**: Pending requests are validated
- **Cleanup**: Automatic cleanup of expired requests

## Monitoring and Logging

### Key Metrics
- Primary contact change requests
- OTP delivery success rates
- Verification success rates
- Error rates by type

### Log Messages
- Primary contact change requests
- OTP generation and sending
- Verification attempts
- Error conditions
- Security events
