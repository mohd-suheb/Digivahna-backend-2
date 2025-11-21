# User Deletion API Documentation

## Overview
The User Deletion API allows users to initiate the deletion process for their accounts. Once triggered, the user's account will be permanently deleted after the specified time frame, unless the user logs in during the deletion period, which will cancel the deletion process.

## Features
- 🌟 **Scheduled Deletion**: Set deletion time from 0 to 30 days
- ✨ **Immediate Deletion**: Set deletion_time_in_days = 0 for instant deletion
- 🔄 **Auto-Cancellation**: Login during deletion period cancels the process
- 🛡️ **QR Code Protection**: QR IDs are blocked but not deleted
- 📊 **Deletion Tracking**: Complete audit trail of deletion requests

## API Endpoints

### 1. Initiate User Deletion
**Endpoint**: `DELETE /api/v1/users/initiate-deletion`  
**Authentication**: No authentication required  
**Description**: Initiates the user deletion process

#### Request Body
```json
{
  "user_id": "user@example.com", // email or phone number
  "deletion_time_in_days": "3", // 0-30 days, 0 = immediate
  "deletion_type": "all", // "all" or "status"
  "reason": "User requested account deletion"
}
```

#### Response Examples

**Success (Scheduled Deletion)**
```json
{
  "status": true,
  "message": "User deletion scheduled after 3 days",
  "deletion_date": "2025-08-19T12:00:00Z"
}
```

**Success (Immediate Deletion)**
```json
{
  "status": true,
  "message": "User deletion scheduled immediately",
  "deletion_date": "2025-01-16T12:00:00Z"
}
```

**Error - Already Requested**
```json
{
  "status": false,
  "message": "User deletion process already initiated",
  "deletion_date": "2025-08-19T12:00:00Z"
}
```

**Error - User Not Found**
```json
{
  "status": false,
  "message": "User does not exist"
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

### 2. Cancel User Deletion
**Endpoint**: `POST /api/v1/users/cancel-deletion`  
**Authentication**: No authentication required  
**Description**: Cancels a pending user deletion (typically called when user logs in)

#### Request Body
```json
{
  "user_id": "user@example.com"
}
```

#### Response
```json
{
  "status": true,
  "message": "User deletion cancelled successfully"
}
```

### 3. Get User Deletion Status
**Endpoint**: `GET /api/v1/users/:user_id/deletion-status`  
**Authentication**: No authentication required  
**Description**: Retrieves the current deletion status of a user

#### Response
```json
{
  "status": true,
  "data": {
    "account_status": "PENDING_DELETION",
    "deletion_date": "2025-08-19T12:00:00Z",
    "qr_id_status": "BLOCKED",
    "deletion_record": {
      "deletion_type": "all",
      "deletion_date": "2025-08-19T12:00:00Z",
      "reason": "User requested account deletion",
      "status": "PENDING_DELETION"
    }
  }
}
```

### 4. Process Pending Deletions (Cron Job)
**Endpoint**: `POST /api/v1/users/process-deletions`  
**Authentication**: No authentication required (should be protected in production)  
**Description**: Processes users whose deletion date has arrived

#### Response
```json
{
  "status": true,
  "message": "Deletion process completed successfully",
  "processed": 5,
  "errors": 0
}
```

## Database Schema Changes

### User Model Updates
```javascript
{
  account_status: {
    type: String,
    enum: ["ACTIVE", "PENDING_DELETION", "DELETED", "SUSPENDED"],
    default: "ACTIVE"
  },
  deletion_date: {
    type: Date,
    default: null
  },
  qr_id_status: {
    type: String,
    enum: ["ACTIVE", "BLOCKED"],
    default: "ACTIVE"
  }
}
```

### UserDeletion Model
```javascript
{
  user_id: String, // email or phone
  deletion_type: String, // "all" or "status"
  deletion_time_in_days: Number, // 0-30
  deletion_date: Date,
  reason: String,
  status: String, // "PENDING_DELETION", "CANCELLED", "COMPLETED"
  qr_ids: [String], // Array of QR IDs to track
  cancelled_at: Date,
  completed_at: Date
}
```

## Process Flow

### 1. Deletion Initiation
1. User calls deletion API
2. System validates user exists
3. Checks for existing deletion request
4. Creates UserDeletion record
5. Updates User account_status to "PENDING_DELETION"
6. Blocks all QR codes (status = "inactive")
7. Sets deletion_date

### 2. Deletion Cancellation (Login)
1. User logs in during deletion period
2. System detects PENDING_DELETION status
3. Cancels deletion process
4. Updates User account_status to "ACTIVE"
5. Reactivates QR codes (status = "active")
6. Marks UserDeletion as "CANCELLED"

### 3. Deletion Processing (Cron Job)
1. Daily cron job runs
2. Finds users with deletion_date <= current_date
3. For deletion_type = "all":
   - Clears user data (keeps basic record)
   - Updates account_status to "DELETED"
4. For deletion_type = "status":
   - Only updates account_status to "DELETED"
5. Marks UserDeletion as "COMPLETED"
6. QR codes remain blocked

## Cron Job Setup

### Manual Execution
```bash
# Process pending deletions
node src/cron/setupCron.js deletion

# Clean up old records
node src/cron/setupCron.js cleanup
```

### Automated Setup (Production)
Set up a daily cron job to run:
```bash
# Add to crontab
0 2 * * * cd /path/to/digivahan-backend && node src/cron/setupCron.js deletion
```

## Error Handling

### Validation Errors
- Invalid user_id format
- Invalid deletion_time_in_days (not 0-30)
- Invalid deletion_type (not "all" or "status")
- Missing required fields

### Business Logic Errors
- User not found
- Deletion already requested
- No pending deletion to cancel

### Server Errors
- Database connection issues
- Internal processing errors

## Security Considerations

1. **No Authentication Required**: As per requirements, but consider adding rate limiting
2. **Input Validation**: Comprehensive validation on all inputs
3. **Data Protection**: QR codes are preserved for tracking
4. **Audit Trail**: Complete logging of all deletion activities
5. **Graceful Degradation**: System continues to function even if deletion process fails

## Testing

### Test Cases
1. **Valid Deletion Request**: Test with valid parameters
2. **Immediate Deletion**: Test with deletion_time_in_days = 0
3. **Duplicate Request**: Test requesting deletion twice
4. **Login Cancellation**: Test login during deletion period
5. **Cron Processing**: Test automatic deletion processing
6. **Invalid Parameters**: Test with invalid inputs
7. **Non-existent User**: Test with invalid user_id

### Sample Test Data
```json
{
  "user_id": "test@example.com",
  "deletion_time_in_days": "1",
  "deletion_type": "all",
  "reason": "Testing deletion API"
}
```

## Monitoring and Logging

### Key Metrics
- Number of deletion requests per day
- Number of cancellations per day
- Number of completed deletions per day
- Error rates and types

### Log Messages
- Deletion initiation
- Deletion cancellation
- Deletion completion
- Error conditions
- Cron job execution

## Future Enhancements

1. **Email Notifications**: Notify users of deletion status
2. **Admin Dashboard**: Web interface for managing deletions
3. **Bulk Operations**: Process multiple deletions
4. **Advanced Scheduling**: More flexible deletion timing
5. **Data Export**: Export user data before deletion
6. **Recovery Options**: Restore deleted accounts within grace period
