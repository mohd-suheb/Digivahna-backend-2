# Get Details API Documentation

## Overview
The Get Details API allows users to fetch their account details fully or partially based on the provided `details_type` parameter. It supports multiple detail types including basic details, public details, address book, emergency contacts, garage, device information, account status, and chat room data.

## Features
- 🌟 **Flexible Data Retrieval**: Fetch specific or all user details
- ✨ **Multiple Detail Types**: Support for 10 different detail types
- 🔄 **Batch Operations**: Get multiple detail types in one request
- 🛡️ **Data Security**: Excludes sensitive information like passwords
- 📊 **Comprehensive Coverage**: Access to all user-related data

## API Endpoints

### 1. Get User Details
**Endpoint**: `POST /get-details`  
**Authentication**: No authentication required (as per requirements)  
**Description**: Get user details based on details_type parameter

#### Request Parameters

**Required Parameters:**
- `user_id` (string): The unique identifier for the user (email or phone number)
- `details_type` (enum): Type of details to fetch

#### Supported Details Types
- `all` - Complete user object (excluding sensitive data)
- `basic_details` - Basic user information
- `public_details` - Public profile information
- `address_book` - User's address book
- `emergency_contacts` - Emergency contact list
- `garage` - Vehicle garage information
- `Device_id` - Device information
- `Account_status` - Account status and suspension details
- `suspend_time` - Suspension time information
- `chat_room` - Chat room data

#### Request Example
```json
{
  "user_id": "user@example.com",
  "details_type": "basic_details"
}
```

#### Response Examples

**Success - All Details**
```json
{
  "status": true,
  "message": "User details fetched successfully.",
  "user": {
    // Complete user object (excluding sensitive data)
  }
}
```

**Success - Basic Details**
```json
{
  "status": true,
  "message": "User details fetched successfully.",
  "user": {
    "basic_details": {
      "profile_pic_url": "https://example.com/profile.jpg",
      "first_name": "John",
      "last_name": "Doe",
      "phone_number": "9876543210",
      "phone_number_verified": true,
      "is_phone_number_primary": true,
      "email": "user@example.com",
      "is_email_verified": true,
      "is_email_primary": false,
      "password": "",
      "occupation": "Software Engineer",
      "profile_completion_percent": 85
    }
  }
}
```

**Success - Public Details**
```json
{
  "status": true,
  "message": "User details fetched successfully.",
  "user": {
    "public_details": {
      "public_pic_url": "https://example.com/public.jpg",
      "nick_name": "Johnny",
      "address": "123 Main St, City",
      "age": 30,
      "gender": "male"
    }
  }
}
```

**Success - Address Book**
```json
{
  "status": true,
  "message": "User addressbook fetched successfully.",
  "address_book": [
    {
      "address_id": "ADDR12345678",
      "name": "John Doe",
      "contact_no": "9876543210",
      "house_no_or_building": "123 Main St",
      "road_or_area": "Downtown",
      "area": "Central",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "default": true
    }
  ]
}
```

**Success - Emergency Contacts**
```json
{
  "status": true,
  "message": "User emergency contacts fetched successfully.",
  "emergency_contacts": [
    {
      "contact_id": "EC12345678",
      "first_name": "Jane",
      "last_name": "Doe",
      "profile_pic": "https://example.com/contact.jpg",
      "relation": "Spouse",
      "phone_number": "9876543211",
      "email": "jane@example.com"
    }
  ]
}
```

**Success - Garage Details**
```json
{
  "status": true,
  "message": "User garage details fetched successfully.",
  "garage": {
    "vehicles": [
      {
        "vehicle_id": "vhl_932459",
        "qr_info": {
          "qr_id": "QR12345678",
          "qr_image": "https://example.com/qr.png"
        },
        "vehicle_info": {
          "owner_name": "John Doe",
          "vehicle_number": "MH12AB1234",
          "vehicle_name": "Maruti Swift VDI",
          "registration_date": "2021-06-15",
          "ownership_details": "1st Owner",
          "financer_name": "HDFC Bank",
          "registered_rto": "Pune RTO",
          "makers_model": "Swift",
          "makers_name": "Maruti Suzuki",
          "vehicle_class": "LMV",
          "fuel_type": "Diesel",
          "fuel_norms": "BS6",
          "engine": "1248cc",
          "chassis_number": "MBHNA34XXXXXX987",
          "insurer_name": "Bajaj Allianz",
          "insurance_type": "Comprehensive",
          "insurance_expiry": "2025-06-14",
          "insurance_renewed_date": "2024-06-10",
          "vehicle_age": "4 Years",
          "fitness_upto": "2026-06-15",
          "pollution_renew_date": "2025-05-01",
          "pollution_expiry": "2025-11-01",
          "color": "White",
          "unloaded_weight": "980 KG",
          "rc_status": "Active",
          "insurance_policy_number": "BAJ123456789"
        },
        "vehicle_documents": {
          "insurance": {
            "file_url": "https://xyz.com/docs/insurance1234.pdf"
          },
          "pollution": {
            "file_url": "https://xyz.com/docs/puc1234.pdf"
          },
          "registration": {
            "file_url": "https://xyz.com/docs/rc1234.pdf"
          },
          "other_documents": [
            {
              "doc_name": "Aadhar Card",
              "doc_number": "234344332332",
              "doc_url": "https://xyz.com/docs/aadhar.pdf"
            }
          ]
        }
      }
    ]
  }
}
```

**Success - Device List**
```json
{
  "status": true,
  "message": "User device list fetched successfully.",
  "device_list": [
    {
      "device_name": "Oppo",
      "device_version": "Android 14",
      "device_model": "OPPO F1 S",
      "app_version": "0.1",
      "player_id": "StrongPass123",
      "uuid": "dffdssdcdsdfdscs"
    }
  ]
}
```

**Success - Account Status**
```json
{
  "status": true,
  "message": "User account status fetched successfully.",
  "user_id": "66b29a5f89d3a9c5cabc1234",
  "account_status": "ACTIVE",
  "suspend_on": null,
  "suspend_until": null,
  "reason": null
}
```

**Success - Chat Room**
```json
{
  "status": true,
  "message": "User chat room fetched successfully.",
  "chat_box": [
    {
      "user_name": "John Doe",
      "user_id": "user123",
      "user_image": "https://example.com/user.jpg",
      "user_last_message": "Hello there!",
      "user_last_message_time": "2025-01-16T10:00:00Z",
      "chat_room_id": "room123"
    }
  ]
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

**Error - Server Issue**
```json
{
  "status": false,
  "error_type": "other",
  "message": "Server Issue."
}
```

### 2. Get Multiple User Details
**Endpoint**: `POST /get-details/multiple`  
**Authentication**: No authentication required  
**Description**: Get multiple user details in one request

#### Request Parameters
- `user_id` (string): The unique identifier for the user
- `details_types` (array): Array of detail types to fetch

#### Request Example
```json
{
  "user_id": "user@example.com",
  "details_types": ["basic_details", "public_details", "address_book"]
}
```

#### Response
```json
{
  "status": true,
  "message": "User details fetched successfully.",
  "basic_details": {
    // Basic details object
  },
  "public_details": {
    // Public details object
  },
  "address_book": [
    // Address book array
  ]
}
```

### 3. Get User Summary
**Endpoint**: `GET /get-details/:user_id/summary`  
**Authentication**: No authentication required  
**Description**: Get user summary (basic info only)

#### Response
```json
{
  "status": true,
  "message": "User summary fetched successfully.",
  "user": {
    "user_id": "66b29a5f89d3a9c5cabc1234",
    "first_name": "John",
    "last_name": "Doe",
    "email": "user@example.com",
    "phone_number": "9876543210",
    "profile_pic_url": "https://example.com/profile.jpg",
    "account_status": "ACTIVE",
    "profile_completion_percent": 85,
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-16T10:00:00Z"
  }
}
```

## Business Logic

### Data Retrieval Flow
1. **Validation**: Validate user_id and details_type parameters
2. **User Lookup**: Find user by email or phone
3. **Account Check**: Verify user is active and not deleted
4. **Data Processing**: Process requested detail type
5. **Data Filtering**: Remove sensitive information
6. **Response**: Return formatted data

### Data Security
- **Password Exclusion**: Never returns password in any response
- **Sensitive Data**: Filters out sensitive information
- **User Isolation**: Users can only access their own data
- **Account Status**: Respects account status restrictions

### Detail Type Processing
- **All**: Returns complete user object (excluding sensitive data)
- **Basic Details**: Returns basic user information
- **Public Details**: Returns public profile information
- **Address Book**: Returns user's address book
- **Emergency Contacts**: Returns emergency contact list
- **Garage**: Returns vehicle garage information
- **Device ID**: Returns device information from DeviceData model
- **Account Status**: Returns account status and suspension details
- **Suspend Time**: Returns suspension time information
- **Chat Room**: Returns chat room data

## Error Handling

### Validation Errors
- Missing required fields
- Invalid user_id format
- Invalid details_type value
- Invalid details_types array

### Business Logic Errors
- User not found
- Account deleted or inactive
- Invalid detail type

### Server Errors
- Database connection issues
- Internal processing errors

## Database Schema

### User Model Fields
```javascript
{
  basic_details: {
    profile_pic_url: String,
    first_name: String,
    last_name: String,
    phone_number: String,
    phone_number_verified: Boolean,
    is_phone_number_primary: Boolean,
    email: String,
    is_email_verified: Boolean,
    is_email_primary: Boolean,
    password: String, // Never returned in API
    occupation: String,
    profile_completion_percent: Number
  },
  public_details: {
    public_pic_url: String,
    nick_name: String,
    address: String,
    age: Number,
    gender: String
  },
  address_book: [{
    address_id: String,
    name: String,
    contact_no: String,
    house_no_or_building: String,
    road_or_area: String,
    area: String,
    city: String,
    state: String,
    pincode: String,
    default: Boolean
  }],
  emergency_contacts: [{
    contact_id: String,
    first_name: String,
    last_name: String,
    profile_pic: String,
    relation: String,
    phone_number: String,
    email: String
  }],
  garage: {
    vehicles: [{
      vehicle_id: String,
      qr_info: Object,
      vehicle_info: Object,
      vehicle_documents: Object
    }]
  },
  chat_room: [{
    user_name: String,
    user_id: String,
    user_image: String,
    user_last_message: String,
    user_last_message_time: String,
    chat_room_id: String
  }],
  account_status: String,
  suspend_on: Date,
  suspend_until: Date,
  suspend_reason: String
}
```

### DeviceData Model
```javascript
{
  user_id: String,
  device_name: String,
  device_version: String,
  device_model: String,
  app_version: String,
  player_id: String,
  uuid: String
}
```

## Testing

### Test Cases
1. **All Details**: Test fetching all user details
2. **Basic Details**: Test fetching basic details only
3. **Public Details**: Test fetching public details only
4. **Address Book**: Test fetching address book
5. **Emergency Contacts**: Test fetching emergency contacts
6. **Garage**: Test fetching garage details
7. **Device List**: Test fetching device information
8. **Account Status**: Test fetching account status
9. **Chat Room**: Test fetching chat room data
10. **Multiple Details**: Test fetching multiple detail types
11. **User Summary**: Test fetching user summary
12. **Invalid Parameters**: Test with invalid parameters
13. **User Not Found**: Test with non-existent user

### Sample Test Data
```json
{
  "user_id": "test@example.com",
  "details_type": "basic_details"
}
```

## Integration Notes

### Database Integration
- Uses existing User and DeviceData models
- Maintains data integrity
- Preserves existing relationships

### Security Integration
- Follows existing security patterns
- Maintains data privacy
- Consistent error handling

### Performance Integration
- Optimized database queries
- Efficient data processing
- Minimal data transfer

## Performance Considerations

1. **Database Queries**: Optimized user lookup and data retrieval
2. **Data Processing**: Efficient data filtering and formatting
3. **Response Optimization**: Minimal data transfer in responses
4. **Caching**: Consider caching for frequently accessed data

## Future Enhancements

1. **Data Pagination**: Support for paginated data retrieval
2. **Field Selection**: Allow specific field selection
3. **Data Filtering**: Advanced filtering options
4. **Data Sorting**: Sorting options for list data
5. **Data Aggregation**: Aggregate data across multiple users
6. **Real-time Updates**: WebSocket support for real-time data
7. **Data Export**: Export data in various formats
8. **Data Analytics**: Analytics and reporting features

## Security Considerations

### Data Privacy
- Never expose sensitive information
- Filter out passwords and sensitive data
- Respect user privacy settings

### Access Control
- Users can only access their own data
- Account status restrictions
- No authentication required (as per requirements)

### Data Validation
- Comprehensive input validation
- SQL injection prevention
- XSS protection

## Monitoring and Logging

### Key Metrics
- API request counts by detail type
- Response times
- Error rates
- User data access patterns

### Log Messages
- User data access requests
- Error conditions
- Security events
- Performance metrics

### Security Monitoring
- Track data access patterns
- Monitor for suspicious activity
- Alert on security events
- Log access attempts
