# Notification List API Documentation

## Overview
The Notification List API is designed to fetch notifications from the notification table with pagination and filtering capabilities. Users can retrieve their notifications with customizable page size, page number, and notification type filtering. The API supports multiple notification types and provides comprehensive pagination information.

## Features
- 🌟 **Pagination Support**: Configurable page size and page number
- ✨ **Type Filtering**: Filter notifications by type (otp, all, order, doc_vault_access, alert, other)
- 🔄 **Comprehensive Data**: Complete notification details with sender information
- 🛡️ **User Validation**: Ensures user exists and is active
- 📊 **Statistics**: Get notification statistics and counts
- 🔐 **Bulk Operations**: Mark all as read, delete old notifications

## API Endpoints

### 1. Get Notification List
**Endpoint**: `POST /notification_list`  
**Authentication**: No authentication required (as per requirements)  
**Description**: Fetch notifications with pagination and filtering

#### Request Parameters

**Required Parameters:**
- `user_id` (string): User identifier (email or phone number)

**Optional Parameters:**
- `page` (string): Page number (default: "1")
- `limit` (string): Number of notifications per page (default: "20", max: 100)
- `type` (enum): Notification type filter

#### Supported Notification Types
- `otp` - OTP-related notifications
- `all` - All notifications (default)
- `order` - Order-related notifications
- `doc_vault_access` - Document vault access notifications
- `alert` - Alert notifications
- `other` - Other types of notifications

#### Request Example
```json
{
  "user_id": "user@example.com",
  "page": "1",
  "limit": "20",
  "type": "all"
}
```

#### Response Example
```json
{
  "status": true,
  "message": "successful",
  "current_page": "1",
  "total_page": "5",
  "notifications": [
    {
      "notification_id": "64f9c1a8d2a3b8e0b9123456",
      "receiver_id": "64f9c1a8d2a3b8e0b9123456",
      "sender_id": "64f9c1a8d2a3b8e0b9123456",
      "sender_pic": "https://example.com/images/user1.png",
      "sender_name": "John Doe",
      "sent_time": "2025-08-12T10:30:00Z",
      "notification_type": "vehicle",
      "notification_text": "Your vehicle has been updated",
      "link": "https://example.com/vehicles/123",
      "vehicle_or_item_id": "VHC-2025-0001",
      "chat_data": {
        "chat_room_id": "",
        "latitude": "",
        "longitude": "",
        "message": "",
        "incident_proof_file": ""
      },
      "is_read": false,
      "created_at": "2025-01-16T10:00:00Z",
      "updated_at": "2025-01-16T10:00:00Z"
    },
    {
      "notification_id": "64f9c1a8d2a3b8e0b9123457",
      "sender_id": "64f9c1a8d2a3b8e0b91234567",
      "receiver_id": "64f9c1a8d2a3b8e0b9123456",
      "sender_pic": "https://example.com/images/user2.png",
      "sender_name": "Jane Smith",
      "sent_time": "2025-08-12T10:30:00Z",
      "notification_type": "vehicle",
      "notification_text": "Accident reported",
      "link": "https://example.com/vehicles/123",
      "vehicle_or_item_id": "VHC-2025-0001",
      "chat_data": {
        "chat_room_id": "room123",
        "latitude": "19.0760",
        "longitude": "72.8777",
        "message": "Emergency situation at location",
        "incident_proof_file": "https://example.com/incident.jpg"
      },
      "is_read": true,
      "created_at": "2025-01-16T09:00:00Z",
      "updated_at": "2025-01-16T09:00:00Z"
    }
  ],
  "pagination_info": {
    "current_page": 1,
    "total_pages": 5,
    "total_count": 100,
    "per_page": 20,
    "has_next": true,
    "has_prev": false,
    "next_page": 2,
    "prev_page": null
  }
}
```

**Error - No Page Available**
```json
{
  "status": false,
  "error_type": "page",
  "message": "No Page available"
}
```

**Error - Page Limit Reached**
```json
{
  "status": false,
  "error_type": "page",
  "message": "Page limit reached"
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

**Error - Invalid Parameter**
```json
{
  "status": false,
  "error_type": "other",
  "message": "You have entered invalid parameter"
}
```

### 2. Get Notification Statistics
**Endpoint**: `GET /notification_list/:user_id/stats`  
**Authentication**: No authentication required  
**Description**: Get notification statistics and counts

#### Response
```json
{
  "status": true,
  "message": "Notification statistics retrieved successfully",
  "data": {
    "total_notifications": 150,
    "unread_notifications": 25,
    "by_type": {
      "vehicle": {
        "total": 50,
        "unread": 10
      },
      "order": {
        "total": 30,
        "unread": 5
      },
      "doc_access": {
        "total": 20,
        "unread": 3
      },
      "chat": {
        "total": 40,
        "unread": 7
      },
      "other": {
        "total": 10,
        "unread": 0
      }
    },
    "read_percentage": 83
  }
}
```

### 3. Mark All Notifications as Read
**Endpoint**: `POST /notification_list/:user_id/mark-all-read`  
**Authentication**: No authentication required  
**Description**: Mark all notifications as read for a user

#### Response
```json
{
  "status": true,
  "message": "All notifications marked as read successfully",
  "data": {
    "modified_count": 25
  }
}
```

### 4. Delete Old Notifications
**Endpoint**: `POST /notification_list/:user_id/delete-old`  
**Authentication**: No authentication required  
**Description**: Delete old notifications older than specified days

#### Request Body
```json
{
  "days_old": 30
}
```

#### Response
```json
{
  "status": true,
  "message": "Old notifications deleted successfully",
  "data": {
    "deleted_count": 50,
    "cutoff_date": "2024-12-17T10:00:00Z"
  }
}
```

## Business Logic

### Notification Retrieval Flow
1. **Validation**: Validate user_id, page, limit, and type parameters
2. **User Check**: Verify user exists and is active
3. **Query Building**: Build MongoDB query with filters
4. **Pagination**: Calculate skip and limit for pagination
5. **Data Retrieval**: Fetch notifications with sender information
6. **Formatting**: Format response data with proper structure
7. **Response**: Return paginated results with metadata

### Type Filtering Logic
- **All**: Returns all notification types
- **Specific Types**: Filters by notification_type field
- **Type Mapping**: Maps API types to database notification_type values
- **Default Behavior**: Returns all if no type specified

### Pagination Logic
- **Page Calculation**: Calculates total pages based on count and limit
- **Boundary Checks**: Validates page number against available pages
- **Limit Validation**: Ensures limit is within acceptable range (1-100)
- **Skip Calculation**: Calculates documents to skip for pagination

### Data Formatting
- **Sender Information**: Populates sender details from User model
- **Chat Data**: Formats chat data with proper structure
- **Timestamps**: Converts dates to ISO format
- **Read Status**: Includes read/unread status
- **Metadata**: Adds pagination and statistics information

## Error Handling

### Validation Errors
- Missing user_id
- Invalid page number (must be positive integer)
- Invalid limit (must be 1-100)
- Invalid notification type
- Invalid user_id format

### Business Logic Errors
- User not found
- Account deleted or inactive
- Page number exceeds available pages
- Page limit exceeded (1000 pages max)

### Server Errors
- Database connection issues
- Internal processing errors
- Query execution failures

## Database Schema

### Notification Model Fields Used
```javascript
{
  _id: ObjectId,                 // Notification ID
  sender_id: ObjectId,           // Reference to User
  receiver_id: ObjectId,         // Reference to User
  sender_pic: String,            // Sender profile picture
  sender_name: String,           // Sender name
  notification_type: String,     // Type of notification
  notification_text: String,     // Notification content
  link: String,                  // Associated URL
  vehicle_or_item_id: String,    // Vehicle or item ID
  chat_data: Object,             // Chat-specific data
  chat_room_id: String,          // Chat room ID
  is_read: Boolean,              // Read status
  sent_time: Date,               // When notification was sent
  createdAt: Date,               // Creation timestamp
  updatedAt: Date                // Last update timestamp
}
```

### User Model Fields Used
```javascript
{
  _id: ObjectId,                 // User ID
  basic_details: {
    first_name: String,          // User's first name
    last_name: String,           // User's last name
    profile_pic_url: String      // Profile picture URL
  },
  account_status: String         // Account status
}
```

## Testing

### Test Cases
1. **Basic Retrieval**: Test fetching notifications with default parameters
2. **Pagination**: Test pagination with different page numbers and limits
3. **Type Filtering**: Test filtering by different notification types
4. **User Validation**: Test with non-existent users
5. **Boundary Testing**: Test edge cases for pagination
6. **Statistics**: Test notification statistics retrieval
7. **Mark All Read**: Test marking all notifications as read
8. **Delete Old**: Test deleting old notifications
9. **Error Handling**: Test various error scenarios
10. **Data Formatting**: Test response data formatting

### Sample Test Data
```json
{
  "user_id": "test@example.com",
  "page": "1",
  "limit": "10",
  "type": "vehicle"
}
```

## Integration Notes

### Database Integration
- Uses existing Notification and User models
- Maintains data integrity
- Preserves existing relationships
- Optimized queries with proper indexing

### Validation Integration
- Uses express-validator middleware
- Comprehensive input validation
- Custom validation rules
- Consistent error handling

### Performance Integration
- Efficient database queries
- Proper pagination implementation
- Optimized data formatting
- Minimal data transfer

## Performance Considerations

1. **Database Queries**: Optimized queries with proper indexing
2. **Pagination**: Efficient skip and limit implementation
3. **Data Formatting**: Minimal processing overhead
4. **Response Size**: Controlled response size with pagination

## Future Enhancements

1. **Advanced Filtering**: Date range, read status, sender filtering
2. **Sorting Options**: Sort by date, type, read status
3. **Search Functionality**: Search within notification text
4. **Bulk Operations**: Bulk mark as read, bulk delete
5. **Notification Categories**: Group notifications by category
6. **Real-time Updates**: WebSocket support for real-time updates
7. **Export Functionality**: Export notifications to various formats
8. **Analytics**: Detailed notification analytics and insights

## Security Considerations

### Data Privacy
- Users can only access their own notifications
- No sensitive data exposure
- Proper data sanitization

### Access Control
- No authentication required (as per requirements)
- User validation ensures data isolation
- Input validation prevents injection attacks

### Rate Limiting
- Consider implementing rate limiting
- Prevent abuse of pagination
- Monitor for unusual access patterns

## Monitoring and Logging

### Key Metrics
- API request counts
- Response times
- Error rates
- Pagination usage patterns

### Log Messages
- Notification retrieval requests
- Pagination calculations
- Error conditions
- Performance metrics

### Security Monitoring
- Track access patterns
- Monitor for unusual activity
- Alert on security events
- Log access attempts
