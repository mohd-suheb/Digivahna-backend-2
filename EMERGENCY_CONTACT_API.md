# Emergency Contact API Documentation

## Overview
The Emergency Contact API allows users to manage their emergency contacts through CRUD operations. Users can add, edit, and delete emergency contacts with their personal information and profile pictures.

## Features
- 🌟 **CRUD Operations**: Add, edit, and delete emergency contacts
- ✨ **Base64 Image Support**: Upload profile pictures as base64 encoded strings
- 🔄 **Flexible Updates**: Update specific fields without affecting others
- 🛡️ **Data Validation**: Comprehensive validation for all fields
- 📊 **Contact Management**: Unique contact IDs for each emergency contact

## API Endpoints

### 1. Manage Emergency Contacts
**Endpoint**: `POST /api/v1/emergency-contact`  
**Authentication**: Basic auth (as per requirements)  
**Description**: Add, edit, or delete emergency contacts based on hit_type

#### Request Parameters

**Required Parameters:**
- `user_id` (string): The unique identifier for the user (email or phone number)
- `hit_type` (enum): Operation type - "add", "edit", or "delete"

**Conditional Parameters:**
- `contact_id` (string): Required for "edit" and "delete" operations
- `first_name` (string): Required for "add" operation
- `last_name` (string): Required for "add" operation
- `relation` (string): Required for "add" operation
- `phone_number` (string): Required for "add" operation

**Optional Parameters:**
- `profile_pic` (string): Base64 encoded image (data:image/jpeg;base64,...)
- `email` (string): Contact's email address

#### Request Examples

**Add New Contact**
```json
{
  "user_id": "user@example.com",
  "hit_type": "add",
  "first_name": "Ramesh",
  "last_name": "Sharma",
  "relation": "Father",
  "phone_number": "+919123456789",
  "email": "ramesh.sharma@example.com",
  "profile_pic": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
}
```

**Edit Existing Contact**
```json
{
  "user_id": "user@example.com",
  "hit_type": "edit",
  "contact_id": "EC098765",
  "first_name": "Ramesh Kumar",
  "phone_number": "+919876543210"
}
```

**Delete Contact**
```json
{
  "user_id": "user@example.com",
  "hit_type": "delete",
  "contact_id": "EC098765"
}
```

#### Response Examples

**Success - Contact Added**
```json
{
  "status": true,
  "message": "New Emergency contact added successfully",
  "data": {
    "contact_id": "EC098765",
    "first_name": "Ramesh",
    "last_name": "Sharma",
    "relation": "Father",
    "phone_number": "+919123456789",
    "email": "ramesh.sharma@example.com",
    "profile_pic": "https://s3.amazonaws.com/bucket/emergency-contacts/EC098765.jpg"
  }
}
```

**Success - Contact Updated**
```json
{
  "status": true,
  "message": "Emergency contact updated successfully",
  "data": {
    "contact_id": "EC098765",
    "first_name": "Ramesh Kumar",
    "last_name": "Sharma",
    "relation": "Father",
    "phone_number": "+919876543210",
    "email": "ramesh.sharma@example.com",
    "profile_pic": "https://s3.amazonaws.com/bucket/emergency-contacts/EC098765.jpg"
  }
}
```

**Success - Contact Deleted**
```json
{
  "status": true,
  "message": "Emergency contact deleted successfully",
  "data": {
    "contact_id": "EC098765",
    "first_name": "Ramesh",
    "last_name": "Sharma",
    "relation": "Father",
    "phone_number": "+919123456789",
    "email": "ramesh.sharma@example.com",
    "profile_pic": "https://s3.amazonaws.com/bucket/emergency-contacts/EC098765.jpg"
  }
}
```

**Error - Contact Not Found**
```json
{
  "status": false,
  "error_type": "invalid_id",
  "message": "No valid contact id provided or contact not found"
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

### 2. Get All Emergency Contacts
**Endpoint**: `GET /api/v1/emergency-contact/:user_id`  
**Authentication**: Basic auth  
**Description**: Retrieve all emergency contacts for a user

#### Response
```json
{
  "status": true,
  "message": "Emergency contacts retrieved successfully",
  "data": {
    "contacts": [
      {
        "contact_id": "EC098765",
        "first_name": "Ramesh",
        "last_name": "Sharma",
        "relation": "Father",
        "phone_number": "+919123456789",
        "email": "ramesh.sharma@example.com",
        "profile_pic": "https://s3.amazonaws.com/bucket/emergency-contacts/EC098765.jpg",
        "created_at": "2025-01-16T10:00:00Z",
        "updated_at": "2025-01-16T10:00:00Z"
      }
    ],
    "total_contacts": 1
  }
}
```

### 3. Get Specific Emergency Contact
**Endpoint**: `GET /api/v1/emergency-contact/:user_id/:contact_id`  
**Authentication**: Basic auth  
**Description**: Retrieve a specific emergency contact

#### Response
```json
{
  "status": true,
  "message": "Emergency contact retrieved successfully",
  "data": {
    "contact_id": "EC098765",
    "first_name": "Ramesh",
    "last_name": "Sharma",
    "relation": "Father",
    "phone_number": "+919123456789",
    "email": "ramesh.sharma@example.com",
    "profile_pic": "https://s3.amazonaws.com/bucket/emergency-contacts/EC098765.jpg",
    "created_at": "2025-01-16T10:00:00Z",
    "updated_at": "2025-01-16T10:00:00Z"
  }
}
```

## Field Validation Rules

### Required Fields (for "add" operation)
- **user_id**: Valid email or phone number
- **hit_type**: Must be "add", "edit", or "delete"
- **first_name**: 1-50 characters, letters and spaces only
- **last_name**: 1-50 characters, letters and spaces only
- **relation**: 1-50 characters, letters and spaces only
- **phone_number**: 10-15 characters, digits with optional formatting

### Optional Fields
- **contact_id**: Required for "edit" and "delete" operations
- **email**: Valid email format
- **profile_pic**: Base64 encoded image (data:image/format;base64,...)

### Validation Rules
- **Names**: Letters and spaces only, 1-50 characters
- **Phone**: Digits, spaces, hyphens, parentheses, optional + sign
- **Email**: Valid email format, normalized to lowercase
- **Base64 Image**: Must start with "data:image/" and contain valid base64 data

## Business Logic

### Add Operation (hit_type: "add")
1. **Validation**: Validate all required fields
2. **Contact ID Generation**: Generate unique contact ID (EC + 8 hex characters)
3. **Image Processing**: Convert base64 to image and upload to S3
4. **Contact Creation**: Create new contact object
5. **Database Update**: Add contact to user's emergency_contacts array
6. **Response**: Return created contact data

### Edit Operation (hit_type: "edit")
1. **Validation**: Validate contact_id and user_id
2. **Contact Lookup**: Find existing contact by contact_id
3. **Field Updates**: Update only provided fields
4. **Image Processing**: Process new base64 image if provided
5. **Database Update**: Update contact in user's emergency_contacts array
6. **Response**: Return updated contact data

### Delete Operation (hit_type: "delete")
1. **Validation**: Validate contact_id and user_id
2. **Contact Lookup**: Find existing contact by contact_id
3. **Contact Removal**: Remove contact from user's emergency_contacts array
4. **Database Update**: Save updated user document
5. **Response**: Return deleted contact data

### Contact ID Generation
- Format: "EC" + 8 hexadecimal characters (uppercase)
- Example: "EC098765", "ECA1B2C3D"
- Generated using crypto.randomBytes(4).toString('hex').toUpperCase()

### Image Processing
- Accepts base64 encoded images
- Format: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
- Extracts image format and data
- Converts to buffer and uploads to S3
- Stores in "emergency-contacts" folder
- Filename: {contact_id}.{format}

## Error Handling

### Validation Errors
- Missing required fields
- Invalid field formats
- Invalid hit_type values
- Missing contact_id for edit/delete operations

### Business Logic Errors
- User not found
- Contact not found
- Invalid base64 image format
- Image upload failures

### Server Errors
- Database connection issues
- S3 upload failures
- Internal processing errors

## Security Considerations

1. **Input Validation**: Comprehensive validation on all inputs
2. **Base64 Processing**: Secure handling of base64 image data
3. **File Upload Security**: Image format and size validation
4. **Data Sanitization**: Trim whitespace and normalize data
5. **User Verification**: Verify user exists and is active
6. **Contact Isolation**: Users can only access their own contacts

## Database Schema

### User Model - Emergency Contacts Array
```javascript
emergency_contacts: [{
  contact_id: String,        // Unique contact identifier
  first_name: String,        // Contact's first name
  last_name: String,         // Contact's last name
  relation: String,          // Relationship to user
  phone_number: String,      // Contact's phone number
  email: String,             // Contact's email (optional)
  profile_pic: String,       // S3 URL of profile picture
  created_at: Date,          // Creation timestamp
  updated_at: Date           // Last update timestamp
}]
```

## Testing

### Test Cases
1. **Add Contact**: Test adding new emergency contact
2. **Edit Contact**: Test updating existing contact
3. **Delete Contact**: Test removing contact
4. **Get All Contacts**: Test retrieving all contacts
5. **Get Specific Contact**: Test retrieving single contact
6. **Validation Errors**: Test with invalid inputs
7. **Image Upload**: Test base64 image processing
8. **Contact Not Found**: Test with non-existent contact_id

### Sample Test Data
```json
{
  "user_id": "test@example.com",
  "hit_type": "add",
  "first_name": "Test",
  "last_name": "Contact",
  "relation": "Friend",
  "phone_number": "+919876543210",
  "email": "test.contact@example.com",
  "profile_pic": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
}
```

## Integration Notes

### S3 Integration
- Uses existing S3 upload utilities
- Stores images in "emergency-contacts" folder
- Generates unique filenames using contact_id
- Supports multiple image formats (JPEG, PNG, GIF, WebP)

### Database Integration
- Updates existing User model
- Maintains data integrity
- Preserves existing relationships
- Automatic timestamp management

### Authentication Integration
- Compatible with existing auth middleware
- Supports basic authentication as specified
- Maintains user session integrity

## Performance Considerations

1. **Image Processing**: Efficient base64 to buffer conversion
2. **Database Queries**: Optimized user lookup and updates
3. **Validation Efficiency**: Early validation to prevent unnecessary processing
4. **Response Optimization**: Minimal data transfer in responses

## Future Enhancements

1. **Bulk Operations**: Support for adding/updating multiple contacts
2. **Image Optimization**: Automatic image resizing and compression
3. **Contact Categories**: Support for different contact types
4. **Import/Export**: CSV import/export functionality
5. **Contact Sharing**: Share contacts between users
6. **Advanced Search**: Search contacts by name, relation, etc.
7. **Contact Groups**: Organize contacts into groups
8. **Backup/Restore**: Backup and restore contact data
