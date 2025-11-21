# Send Notification API Documentation

## Overview
The Send Notification API creates notifications and stores them in the notifications collection. Notifications are sent in real-time using OneSignal and are also stored for users to view later. The API supports multiple notification types including vehicle, order, document access, chat, and other notifications.

## Features
- 🌟 **Real-time Push Notifications**: OneSignal integration for instant delivery
- ✨ **Persistent Storage**: Notifications stored for later viewing
- 🔄 **Multiple Notification Types**: Support for various notification categories
- 🛡️ **Guest User Support**: Temporary users for guest notifications
- 📊 **Chat Integration**: Special handling for chat notifications
- 🔐 **Rate Limiting**: Protection against spam

## API Endpoints

### 1. Send Notification
**Endpoint**: `POST /api/notifications/send`  
**Authentication**: No authentication required (as per requirements)  
**Description**: Send notification with OneSignal integration and store in database

#### Request Parameters

**Required Parameters:**
- `sender_id` (string): MongoDB ObjectId of the sender
- `receiver_id` (string): MongoDB ObjectId of the receiver
- `sender_name` (string): Name of the sender
- `notification_type` (enum): Type of notification
- `notification_text` (string): Text content of the notification

**Optional Parameters:**
- `sender_pic` (string): URL of sender's profile picture
- `link` (string): URL link associated with the notification
- `vehicle_or_item_id` (string): ID of vehicle or item
- `chat_data` (object): Chat-specific data
- `chat_room` (string): MongoDB ObjectId of chat room

#### Supported Notification Types
- `vehicle` - Vehicle-related notifications
- `order` - Order-related notifications
- `doc_access` - Document access notifications
- `chat` - Chat notifications
- `other` - Other types of notifications

#### Request Examples

**Case 1: Basic Vehicle Notification**
```json
{
  "sender_id": "64f9c1a8d2a3b8e0b9123456",
  "receiver_id": "64f9c1a8d2a3b8e0b9123456",
  "sender_pic": "https://example.com/images/user1.png",
  "sender_name": "Guest",
  "notification_type": "vehicle",
  "notification_text": "Your vehicle has been updated",
  "link": "https://example.com/vehicles/123",
  "vehicle_or_item_id": "VHC-2025-0001"
}
```

**Case 2: Chat Notification with Location Data**
```json
{
  "sender_id": "64f9c1a8d2a3b8e0b9123456",
  "receiver_id": "64f9c1a8d2a3b8e0b9123456",
  "sender_pic": "https://example.com/images/user1.png",
  "sender_name": "Guest",
  "notification_type": "chat",
  "notification_text": "New message received",
  "link": "https://example.com/chat/123",
  "vehicle_or_item_id": "VHC-2025-0001",
  "chat_data": {
    "latitude": "19.0760",
    "longitude": "72.8777",
    "message": "Emergency situation at location",
    "incident_proof_file": "https://example.com/incident.jpg"
  }
}
```

**Case 3: Vault Access Notification**
```json
{
  "sender_id": "64f9c1a8d2a3b8e0b9123456",
  "receiver_id": "64f9c1a8d2a3b8e0b9123456",
  "sender_pic": "https://example.com/images/user1.png",
  "sender_name": "Guest",
  "notification_type": "doc_access",
  "notification_text": "Document access requested",
  "link": "https://example.com/documents/123",
  "vehicle_or_item_id": "VHC-2025-0001",
  "chat_room": "64f9c1a8d2a3b8e0b9123457"
}
```

#### Response Examples

**Success - Basic Notification**
```json
{
  "status": true,
  "message": "Notification sent successfully",
  "data": {
    "Notification_attampet": "1",
    "guest_id": "GUEST12345678",
    "notification_id": "64f9c1a8d2a3b8e0b9123456",
    "sent_time": "2025-08-12T10:30:00Z"
  }
}
```

**Success - Chat Notification**
```json
{
  "status": true,
  "message": "Notification sent successfully for chat",
  "data": {
    "Notification_attampet": "1",
    "guest_id": "GUEST12345678",
    "notification_id": "64f9c1a8d2a3b8e0b9123456",
    "sent_time": "2025-08-12T10:30:00Z",
    "chat_room_id": "64f9c1a8d2a3b8e0b9123457"
  }
}
```

**Error - Rate Limited**
```json
{
  "status": false,
  "error_type": "other",
  "message": "Too many login attempts. Please try again later."
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

### 2. Get User Notifications
**Endpoint**: `GET /api/notifications/:user_id`  
**Authentication**: No authentication required  
**Description**: Retrieve user notifications with pagination

#### Query Parameters
- `notification_type` (optional): Filter by notification type
- `is_read` (optional): Filter by read status
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

#### Response
```json
{
  "status": true,
  "message": "Notifications retrieved successfully",
  "data": {
    "notifications": [
      {
        "_id": "64f9c1a8d2a3b8e0b9123456",
        "sender_id": "64f9c1a8d2a3b8e0b9123456",
        "receiver_id": "64f9c1a8d2a3b8e0b9123456",
        "sender_name": "Guest",
        "notification_type": "vehicle",
        "notification_text": "Your vehicle has been updated",
        "is_read": false,
        "createdAt": "2025-01-16T10:00:00Z"
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

### 3. Mark Notifications as Read
**Endpoint**: `POST /api/notifications/:user_id/mark-read`  
**Authentication**: No authentication required  
**Description**: Mark multiple notifications as read

#### Request Body
```json
{
  "notification_ids": ["64f9c1a8d2a3b8e0b9123456", "64f9c1a8d2a3b8e0b9123457"]
}
```

#### Response
```json
{
  "status": true,
  "message": "Notifications marked as read successfully",
  "data": {
    "modified_count": 2
  }
}
```

### 4. Get Unread Count
**Endpoint**: `GET /api/notifications/:user_id/unread-count`  
**Authentication**: No authentication required  
**Description**: Get count of unread notifications

#### Response
```json
{
  "status": true,
  "message": "Unread count retrieved successfully",
  "data": {
    "unread_count": 5
  }
}
```

### 5. Cleanup Expired Guests
**Endpoint**: `POST /api/notifications/cleanup-expired-guests`  
**Authentication**: No authentication required  
**Description**: Clean up expired guest notifications

#### Response
```json
{
  "status": true,
  "message": "Expired guest notifications cleaned up successfully",
  "data": {
    "deleted_count": 10
  }
}
```

## Business Logic

### Notification Flow
1. **Validation**: Validate all required parameters
2. **User Check**: Check if receiver exists
3. **Guest Handling**: Create temp user if receiver doesn't exist
4. **Device Lookup**: Get OneSignal player ID
5. **Notification Creation**: Create notification record
6. **OneSignal Send**: Send real-time push notification
7. **Storage Update**: Mark notification as sent
8. **Response**: Return success with notification details

### Guest User Handling
- **Temp User Creation**: Creates temporary user for 1 hour
- **Guest ID Generation**: Unique guest ID format (GUEST + 8 hex chars)
- **Expiry Management**: Automatic cleanup after 1 hour
- **Player ID**: Temporary OneSignal player ID

### Chat Data Handling
- **Location Data**: Latitude and longitude for location-based notifications
- **Message Content**: Chat message content
- **Incident Proof**: File URL for incident proof
- **Chat Room**: Associated chat room ID

### OneSignal Integration
- **Real-time Delivery**: Instant push notification delivery
- **Rich Content**: Support for images, links, and custom data
- **Platform Support**: Works on iOS, Android, and web
- **Error Handling**: Graceful handling of OneSignal failures

## Database Schema

### Notification Model
```javascript
{
  sender_id: ObjectId,           // Reference to User
  receiver_id: ObjectId,         // Reference to User (null for guests)
  sender_pic: String,            // Sender profile picture URL
  sender_name: String,           // Sender name
  notification_type: String,     // Enum: vehicle, order, doc_access, chat, other
  notification_text: String,     // Notification content
  link: String,                  // Associated URL
  vehicle_or_item_id: String,    // Vehicle or item identifier
  chat_data: {                   // Chat-specific data
    latitude: String,
    longitude: String,
    message: String,
    incident_proof_file: String
  },
  chat_room: ObjectId,           // Reference to ChatRoom
  chat_room_id: String,          // Chat room ID
  is_read: Boolean,              // Read status
  is_sent: Boolean,              // Sent status
  sent_time: Date,               // When notification was sent
  one_signal_response: Object,   // OneSignal API response
  notification_attempt: Number,  // Attempt number
  guest_id: String,              // Guest identifier
  is_guest_notification: Boolean, // Is guest notification
  guest_expiry: Date,            // Guest expiry time
  createdAt: Date,               // Creation timestamp
  updatedAt: Date                // Last update timestamp
}
```

### TempUser Model
```javascript
{
  guest_id: String,              // Unique guest identifier
  player_id: String,             // OneSignal player ID
  expires_at: Date,              // Expiry timestamp
  createdAt: Date,               // Creation timestamp
  updatedAt: Date                // Last update timestamp
}
```

## OneSignal Configuration

### Environment Variables
```bash
ONE_SIGNAL_APP_ID=your_app_id
ONE_SIGNAL_API_KEY=your_api_key
```

### Notification Payload
```javascript
{
  app_id: "your_app_id",
  include_player_ids: ["player_id"],
  headings: { en: "Sender Name" },
  contents: { en: "Notification Text" },
  data: {
    notification_type: "vehicle",
    link: "https://example.com/vehicles/123",
    vehicle_or_item_id: "VHC-2025-0001",
    sender_id: "sender_id",
    receiver_id: "receiver_id",
    chat_room_id: "chat_room_id"
  },
  small_icon: "ic_notification",
  large_icon: "profile_pic_url",
  android_accent_color: "FF0000FF",
  priority: 10,
  ttl: 3600
}
```

## Error Handling

### Validation Errors
- Missing required fields
- Invalid ObjectId format
- Invalid notification type
- Invalid URL format
- Invalid data types

### Business Logic Errors
- User not found
- Device not found
- OneSignal configuration error
- OneSignal send failure

### Server Errors
- Database connection issues
- OneSignal API errors
- Internal processing errors

## Testing

### Test Cases
1. **Basic Notification**: Test sending basic notification
2. **Chat Notification**: Test sending chat notification with location
3. **Guest Notification**: Test sending notification to non-existent user
4. **OneSignal Integration**: Test OneSignal API integration
5. **Notification Retrieval**: Test getting user notifications
6. **Mark as Read**: Test marking notifications as read
7. **Unread Count**: Test getting unread count
8. **Guest Cleanup**: Test cleaning up expired guests
9. **Rate Limiting**: Test rate limiting functionality
10. **Error Handling**: Test various error scenarios

### Sample Test Data
```json
{
  "sender_id": "64f9c1a8d2a3b8e0b9123456",
  "receiver_id": "64f9c1a8d2a3b8e0b9123456",
  "sender_name": "Test User",
  "notification_type": "vehicle",
  "notification_text": "Test notification message"
}
```

## Integration Notes

### OneSignal Integration
- Uses OneSignal REST API
- Supports rich notifications
- Handles delivery failures gracefully
- Stores OneSignal response for debugging

### Database Integration
- Uses existing User and DeviceData models
- Maintains data integrity
- Preserves existing relationships
- Automatic cleanup of expired data

### Security Integration
- Follows existing security patterns
- Maintains data privacy
- Consistent error handling
- Rate limiting protection

## Performance Considerations

1. **OneSignal API**: Efficient API calls with proper error handling
2. **Database Queries**: Optimized queries with proper indexing
3. **Guest Cleanup**: Automatic cleanup of expired guest data
4. **Response Optimization**: Minimal data transfer in responses

## Future Enhancements

1. **Notification Templates**: Predefined notification templates
2. **Scheduled Notifications**: Send notifications at specific times
3. **Notification Preferences**: User-specific notification settings
4. **Rich Media**: Support for images, videos, and audio
5. **Notification Analytics**: Track notification performance
6. **Bulk Notifications**: Send notifications to multiple users
7. **Notification Categories**: Organize notifications by category
8. **Push Notification History**: Detailed delivery history

## Security Considerations

### Data Privacy
- Never expose sensitive user information
- Secure handling of guest data
- Proper data encryption

### Access Control
- No authentication required (as per requirements)
- Rate limiting to prevent spam
- Input validation and sanitization

### OneSignal Security
- Secure API key management
- Proper error handling
- No sensitive data in push payloads

## Monitoring and Logging

### Key Metrics
- Notification send success rate
- OneSignal delivery rate
- Guest notification count
- Error rates by type

### Log Messages
- Notification creation
- OneSignal API calls
- Guest user creation
- Error conditions
- Performance metrics

### Security Monitoring
- Track notification patterns
- Monitor for spam attempts
- Alert on unusual activity
- Log security events
