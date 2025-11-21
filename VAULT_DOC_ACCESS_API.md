# Vault Doc Access API Documentation

## Overview
The Vault Doc Access API allows users to request access to specific document information related to a vehicle. It is primarily used to retrieve documents associated with a vehicle identified by its vehicle number, after verifying the security code and requester code. The API provides secure access to vehicle documents with proper authorization and validation.

## Features
- 🌟 **Secure Document Access**: Access vehicle documents with security code verification
- ✨ **Requester Validation**: Verify requester identity and authorization
- 🔄 **Vehicle Number Lookup**: Find vehicles by registration number
- 🛡️ **Security Code Verification**: Validate security codes for access
- 📊 **Access Tracking**: Track access history and statistics
- 🔐 **Authorization**: Ensure only authorized users can access documents

## API Endpoints

### 1. Request Vault Document Access
**Endpoint**: `POST /vault-document-access`  
**Authentication**: No authentication required (as per requirements)  
**Description**: Request access to vehicle documents with security code verification

#### Request Parameters

**Required Parameters:**
- `user_id` (string): A unique identifier for the user making the request (email or phone number)
- `vehicle_number` (string): The registration number of the vehicle (e.g., MH12AB1234)
- `requester_id` (string): Unique code of the person requesting access
- `security_code` (number): Security code of the document

#### Request Example
```json
{
  "user_id": "user@example.com",
  "vehicle_number": "MH12AB1234",
  "requester_id": "REQ123456",
  "security_code": "432324"
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
    "documents": {
      "rc": "https://xyz.com/docs/rc1234.pdf",
      "insurance": "https://xyz.com/docs/insurance1234.pdf",
      "puc": "https://xyz.com/docs/puc1234.pdf",
      "other": [
        {
          "doc_id": "doc_VEH001_0",
          "doc_name": "Aadhar Card",
          "doc_number": "234344332332",
          "doc_url": "https://xyz.com/docs/aadhar.pdf"
        },
        {
          "doc_id": "doc_VEH001_1",
          "doc_name": "PAN Card",
          "doc_number": "AURPH2343D",
          "doc_url": "https://xyz.com/docs/pan.pdf"
        }
      ]
    },
    "access_info": {
      "requester_id": "REQ123456",
      "security_code": "432324",
      "access_count": 1,
      "max_access_count": 1,
      "expires_at": "2025-01-16T10:10:00Z"
    }
  }
}
```

**Error - Unauthorized Access**
```json
{
  "status": false,
  "error_type": "vehicle",
  "message": "unauthorised access"
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

**Error - Invalid Parameter**
```json
{
  "status": false,
  "error_type": "other",
  "message": "You have entered invalid parameter"
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

### 2. Get Vault Access History
**Endpoint**: `GET /vault-document-access/:user_id/history`  
**Authentication**: No authentication required  
**Description**: Get vault access history for a user

#### Query Parameters
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

#### Response
```json
{
  "status": true,
  "message": "Vault access history retrieved successfully",
  "data": {
    "access_history": [
      {
        "vehicle_id": "VEH001",
        "vehicle_number": "MH12AB1234",
        "security_code": "432324",
        "status": "USED",
        "access_count": 1,
        "max_access_count": 1,
        "created_at": "2025-01-16T10:00:00Z",
        "expires_at": "2025-01-16T10:10:00Z",
        "used_at": "2025-01-16T10:05:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_count": 100,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

### 3. Get Vault Access Statistics
**Endpoint**: `GET /vault-document-access/:user_id/stats`  
**Authentication**: No authentication required  
**Description**: Get vault access statistics for a user

#### Response
```json
{
  "status": true,
  "message": "Vault access statistics retrieved successfully",
  "data": {
    "total_codes": 50,
    "active_codes": 5,
    "used_codes": 30,
    "expired_codes": 15,
    "by_status": {
      "ACTIVE": {
        "count": 5,
        "total_accesses": 0
      },
      "USED": {
        "count": 30,
        "total_accesses": 30
      },
      "EXPIRED": {
        "count": 15,
        "total_accesses": 0
      }
    },
    "success_rate": 60
  }
}
```

### 4. Revoke Vault Access
**Endpoint**: `POST /vault-document-access/revoke`  
**Authentication**: No authentication required  
**Description**: Revoke vault access for a specific vehicle

#### Request Body
```json
{
  "user_id": "user@example.com",
  "vehicle_number": "MH12AB1234",
  "security_code": "432324"
}
```

#### Response
```json
{
  "status": true,
  "message": "Vault access revoked successfully",
  "data": {
    "vehicle_number": "MH12AB1234",
    "security_code": "432324",
    "revoked_count": 1
  }
}
```

## Business Logic

### Vault Access Request Flow
1. **Validation**: Validate all required parameters
2. **User Verification**: Check if user exists and is active
3. **Vehicle Lookup**: Find vehicle by registration number in user's garage
4. **Access Code Verification**: Find and validate active access code
5. **Requester Validation**: Verify requester_id matches access code
6. **Security Check**: Ensure access code can be used (not expired/used)
7. **Access Tracking**: Increment access count
8. **Document Return**: Return vehicle documents with access info

### Security Verification Process
1. **User Validation**: Ensure user exists and is active
2. **Vehicle Ownership**: Verify user owns the vehicle
3. **Access Code Check**: Find active access code for vehicle
4. **Security Code Match**: Verify provided security code matches
5. **Requester Authorization**: Ensure requester is authorized
6. **Expiry Check**: Verify access code is not expired
7. **Usage Check**: Ensure access code can still be used

### Document Access Control
- **Vehicle Ownership**: Users can only access their own vehicles
- **Security Code**: Must provide valid security code
- **Requester ID**: Must match authorized requester
- **Time-based Access**: Access codes expire after 10 minutes
- **Usage Limits**: Configurable maximum access count

## Database Schema

### AccessCode Model (Used for Verification)
```javascript
{
  user_id: ObjectId,           // Reference to User
  vehicle_id: String,          // Vehicle identifier
  security_code: String,       // Security code for access
  vehicle_number: String,      // Vehicle registration number
  status: String,              // ACTIVE, USED, EXPIRED, CANCELLED
  expires_at: Date,            // Expiry timestamp
  access_count: Number,        // Number of accesses
  max_access_count: Number,    // Maximum allowed accesses
  // ... other fields
}
```

### User Model - Garage Structure
```javascript
garage: {
  vehicles: [{
    vehicle_id: String,        // Vehicle identifier
    vehicle_info: {
      vehicle_number: String,  // Registration number (e.g., MH12AB1234)
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
- Missing required fields
- Invalid user_id format
- Invalid vehicle_number format
- Invalid requester_id format
- Invalid security_code format

### Business Logic Errors
- User not found
- Vehicle not found
- Unauthorized access
- Access code expired
- Access code already used
- Invalid security code

### Server Errors
- Database connection issues
- Internal processing errors
- Access verification failures

## Testing

### Test Cases
1. **Valid Access Request**: Test with valid security code and requester
2. **Invalid Security Code**: Test with wrong security code
3. **Expired Access Code**: Test with expired access code
4. **Used Access Code**: Test with already used access code
5. **Invalid Vehicle**: Test with non-existent vehicle
6. **Invalid User**: Test with non-existent user
7. **Unauthorized Requester**: Test with unauthorized requester
8. **Access History**: Test access history retrieval
9. **Access Statistics**: Test statistics retrieval
10. **Revoke Access**: Test access revocation

### Sample Test Data
```json
{
  "user_id": "test@example.com",
  "vehicle_number": "MH12AB1234",
  "requester_id": "REQ123456",
  "security_code": "432324"
}
```

## Integration Notes

### Database Integration
- Uses existing User model and garage structure
- Integrates with AccessCode model for verification
- Maintains data integrity
- Preserves existing relationships

### Security Integration
- Multi-layer security verification
- Time-based access control
- Usage limit enforcement
- Authorization checks

### Performance Integration
- Efficient database queries
- Proper indexing for performance
- Minimal data transfer
- Optimized access verification

## Performance Considerations

1. **Database Queries**: Optimized queries with proper indexing
2. **Access Verification**: Efficient security code lookup
3. **Document Retrieval**: Fast document URL access
4. **Response Optimization**: Minimal data transfer in responses

## Future Enhancements

1. **Advanced Security**: Multi-factor authentication
2. **Document Encryption**: Encrypt document URLs
3. **Access Logging**: Detailed access logging
4. **Bulk Operations**: Bulk access management
5. **Analytics**: Access pattern analytics
6. **Real-time Notifications**: Access notifications
7. **API Rate Limiting**: Rate limiting for security
8. **Document Watermarking**: Add watermarks to documents

## Security Considerations

### Access Control
- Multi-layer security verification
- Time-based access codes
- Usage count limits
- Authorization checks

### Data Protection
- Secure document URL access
- No sensitive data exposure
- Proper validation and sanitization
- Access tracking and logging

### Privacy
- Users can only access their own vehicles
- No unauthorized document access
- Proper user validation
- Secure access code verification

## Monitoring and Logging

### Key Metrics
- Vault access requests
- Access success rate
- Security code usage
- Error rates by type

### Log Messages
- Vault access requests
- Security code verification
- Access granted/denied events
- Error conditions
- Security events

### Security Monitoring
- Track access patterns
- Monitor for unusual activity
- Alert on security events
- Log access attempts
