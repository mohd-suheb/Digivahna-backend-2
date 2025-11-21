# Check Access Code For Document API Documentation

## Overview
The Check Access Code For Document API is used to verify access codes for sharing vehicle documents with requesters. It checks if a security code exists for a given vehicle, validates that it's not expired (within 10 minutes of creation), and returns all document links for the vehicle if the code is valid.

## Features
- 🌟 **Access Code Verification**: Verify security codes for document access
- ✨ **Time-based Expiry**: 10-minute expiry for security codes
- 🔄 **Document Access**: Secure access to vehicle documents
- 🛡️ **User Validation**: Ensures user exists and is active
- 📊 **Access Tracking**: Tracks access count and usage
- 🔐 **Security**: Prevents unauthorized document access

## API Endpoints

### 1. Verify Access Code
**Endpoint**: `POST /verify-access-document`  
**Authentication**: No authentication required (as per requirements)  
**Description**: Verify access code and return vehicle documents

#### Request Parameters

**Required Parameters:**
- `user_id` (string): The unique identifier for the user (email or phone number)
- `vehicle_id` (string): The unique identifier for the vehicle

#### Request Example
```json
{
  "user_id": "user@example.com",
  "vehicle_id": "VEH001"
}
```

#### Response Examples

**Success - Vault Access Granted**
```json
{
  "status": true,
  "message": "Vault access granted successfully",
  "data": {
    "vehicle_number": "MH12AB1234",
    "security_code": "8965",
    "documents": {
      "rc": "https://xyz.com/docs/rc1234.pdf",
      "insurance": "https://xyz.com/docs/insurance1234.pdf",
      "puc": "https://xyz.com/docs/puc1234.pdf",
      "other": [
        {
          "doc_name": "Aadhar Card",
          "doc_number": "234344332332",
          "doc_url": "https://xyz.com/docs/aadhar.pdf"
        },
        {
          "doc_name": "PAN Card",
          "doc_number": "AURPH2343D",
          "doc_url": "https://xyz.com/docs/pan.pdf"
        }
      ]
    },
    "access_info": {
      "expires_at": "2025-01-16T10:10:00Z",
      "access_count": 1,
      "max_access_count": 1
    }
  }
}
```

**Error - Vehicle Not Found**
```json
{
  "status": false,
  "error_type": "vehicle",
  "message": "vehicle not found"
}
```

**Error - Invalid User ID**
```json
{
  "status": false,
  "error_type": "userId",
  "message": "invalid user id"
}
```

**Error - No Request Raised**
```json
{
  "status": false,
  "error_type": "code",
  "message": "No request raised"
}
```

**Error - Server Issue**
```json
{
  "status": false,
  "error_type": "other",
  "message": "Server Issue"
}
```

**Error - Invalid Parameter**
```json
{
  "status": false,
  "error_type": "other",
  "message": "You have entered invalid parameter"
}
```

### 2. Generate Access Code
**Endpoint**: `POST /verify-access-document/generate`  
**Authentication**: No authentication required  
**Description**: Generate access code for document sharing

#### Request Parameters
- `user_id` (string): The unique identifier for the user
- `vehicle_id` (string): The unique identifier for the vehicle
- `max_access_count` (optional): Maximum number of accesses (default: 1, max: 10)

#### Request Example
```json
{
  "user_id": "user@example.com",
  "vehicle_id": "VEH001",
  "max_access_count": 3
}
```

#### Response
```json
{
  "status": true,
  "message": "Access code generated successfully",
  "data": {
    "vehicle_id": "VEH001",
    "vehicle_number": "MH12AB1234",
    "security_code": "8965",
    "expires_at": "2025-01-16T10:10:00Z",
    "max_access_count": 3
  }
}
```

### 3. Get Access Code Status
**Endpoint**: `GET /verify-access-document/:user_id/:vehicle_id/status`  
**Authentication**: No authentication required  
**Description**: Get access code status and information

#### Response
```json
{
  "status": true,
  "message": "Access code status retrieved successfully",
  "data": {
    "vehicle_id": "VEH001",
    "vehicle_number": "MH12AB1234",
    "security_code": "8965",
    "status": "ACTIVE",
    "expires_at": "2025-01-16T10:10:00Z",
    "access_count": 0,
    "max_access_count": 1,
    "created_at": "2025-01-16T10:00:00Z",
    "is_expired": false,
    "can_be_used": true
  }
}
```

### 4. Cancel Access Code
**Endpoint**: `POST /verify-access-document/cancel`  
**Authentication**: No authentication required  
**Description**: Cancel active access code

#### Request Body
```json
{
  "user_id": "user@example.com",
  "vehicle_id": "VEH001"
}
```

#### Response
```json
{
  "status": true,
  "message": "Access code cancelled successfully",
  "data": {
    "cancelled_count": 1
  }
}
```

### 5. Cleanup Expired Access Codes
**Endpoint**: `POST /verify-access-document/cleanup-expired`  
**Authentication**: No authentication required  
**Description**: Cleanup expired access codes

#### Response
```json
{
  "status": true,
  "message": "Expired access codes cleaned up successfully",
  "data": {
    "updated_count": 15
  }
}
```

## Business Logic

### Access Code Verification Flow
1. **Validation**: Validate user_id and vehicle_id parameters
2. **User Check**: Verify user exists and is active
3. **Access Code Lookup**: Find active access code for the vehicle
4. **Expiry Check**: Verify access code is not expired (10 minutes)
5. **Usage Check**: Verify access code can still be used
6. **Vehicle Validation**: Ensure vehicle exists in user's garage
7. **Access Tracking**: Increment access count
8. **Document Return**: Return vehicle documents with access info

### Access Code Generation Flow
1. **Validation**: Validate user_id and vehicle_id parameters
2. **User Check**: Verify user exists and is active
3. **Vehicle Check**: Ensure vehicle exists in user's garage
4. **Cancel Existing**: Cancel any existing active access codes
5. **Generate Code**: Create 4-digit security code
6. **Create Record**: Create access code record with 10-minute expiry
7. **Response**: Return generated access code and details

### Security Features
- **Time-based Expiry**: 10-minute expiry for all access codes
- **Usage Limits**: Configurable maximum access count
- **Auto-cancellation**: New codes cancel existing ones
- **Access Tracking**: Track number of accesses
- **Status Management**: Active, Used, Expired, Cancelled states

## Database Schema

### AccessCode Model
```javascript
{
  user_id: ObjectId,           // Reference to User
  vehicle_id: String,          // Vehicle identifier
  security_code: String,       // 4-digit security code
  vehicle_number: String,      // Vehicle number
  status: String,              // ACTIVE, USED, EXPIRED, CANCELLED
  expires_at: Date,            // Expiry timestamp (10 minutes)
  used_at: Date,               // When code was used
  request_ip: String,          // Request IP address
  user_agent: String,          // User agent string
  access_count: Number,        // Number of times accessed
  max_access_count: Number,    // Maximum allowed accesses
  createdAt: Date,             // Creation timestamp
  updatedAt: Date              // Last update timestamp
}
```

### User Model - Garage Structure
```javascript
garage: {
  vehicles: [{
    vehicle_id: String,        // Vehicle identifier
    vehicle_info: {
      vehicle_number: String,  // Vehicle number
      // ... other vehicle info
    },
    vehicle_documents: {
      registration: {
        file_url: String       // RC document URL
      },
      insurance: {
        file_url: String       // Insurance document URL
      },
      pollution: {
        file_url: String       // PUC document URL
      },
      other_documents: [{
        doc_name: String,      // Document name
        doc_number: String,    // Document number
        doc_url: String        // Document URL
      }]
    }
  }]
}
```

## Error Handling

### Validation Errors
- Missing user_id or vehicle_id
- Invalid user_id format
- Invalid vehicle_id format
- Invalid max_access_count

### Business Logic Errors
- User not found
- Vehicle not found
- No active access code
- Access code expired
- Access code already used
- Access limit reached

### Server Errors
- Database connection issues
- Internal processing errors
- Access code generation failures

## Testing

### Test Cases
1. **Valid Access Code**: Test with valid, non-expired access code
2. **Expired Access Code**: Test with expired access code
3. **Used Access Code**: Test with already used access code
4. **Invalid Vehicle**: Test with non-existent vehicle
5. **Invalid User**: Test with non-existent user
6. **Generate Code**: Test access code generation
7. **Cancel Code**: Test access code cancellation
8. **Status Check**: Test access code status retrieval
9. **Cleanup**: Test expired code cleanup
10. **Edge Cases**: Test boundary conditions

### Sample Test Data
```json
{
  "user_id": "test@example.com",
  "vehicle_id": "VEH001"
}
```

## Integration Notes

### Database Integration
- Uses existing User model and garage structure
- New AccessCode model for access management
- Maintains data integrity
- Preserves existing relationships

### Security Integration
- Time-based access control
- Usage limit enforcement
- Automatic expiry management
- Access tracking and logging

### Performance Integration
- Efficient database queries
- Proper indexing for performance
- Minimal data transfer
- Optimized access code generation

## Performance Considerations

1. **Database Queries**: Optimized queries with proper indexing
2. **Access Code Generation**: Efficient 4-digit code generation
3. **Expiry Management**: Automatic cleanup of expired codes
4. **Response Optimization**: Minimal data transfer in responses

## Future Enhancements

1. **Advanced Security**: Multi-factor authentication
2. **Custom Expiry**: Configurable expiry times
3. **Access Logs**: Detailed access logging
4. **Document Encryption**: Encrypt document URLs
5. **Bulk Operations**: Bulk access code management
6. **Analytics**: Access pattern analytics
7. **Notifications**: Real-time access notifications
8. **API Rate Limiting**: Rate limiting for security

## Security Considerations

### Access Control
- Time-based access codes (10 minutes)
- Usage count limits
- Automatic expiry
- Status-based access control

### Data Protection
- Secure access code generation
- No sensitive data in responses
- Proper validation and sanitization
- Access tracking and logging

### Privacy
- Users can only access their own vehicles
- No unauthorized document access
- Proper user validation
- Secure code generation

## Monitoring and Logging

### Key Metrics
- Access code generation rate
- Access code usage rate
- Expiry and cleanup rates
- Error rates by type

### Log Messages
- Access code generation
- Access code verification
- Expiry and cleanup events
- Error conditions
- Security events

### Security Monitoring
- Track access patterns
- Monitor for unusual activity
- Alert on security events
- Log access attempts
