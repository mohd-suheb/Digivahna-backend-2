# User Addressbook API Documentation

## Overview
The User Addressbook API allows users to manage their address book through CRUD operations. Users can add, edit, and delete addresses with comprehensive address information and default address management.

## Features
- 🌟 **CRUD Operations**: Add, edit, and delete addresses
- ✨ **Default Address Management**: Set and manage default addresses
- 🔄 **Flexible Updates**: Update specific fields without affecting others
- 🛡️ **Data Validation**: Comprehensive validation for all address fields
- 📊 **Address Management**: Unique address IDs for each address

## API Endpoints

### 1. Manage User Address Book
**Endpoint**: `POST /api/v1/user-address`  
**Authentication**: No authentication required (as per requirements)  
**Description**: Add, edit, or delete addresses based on hit_type

#### Request Parameters

**Required Parameters:**
- `user_id` (string): The unique identifier for the user (email or phone number)
- `hit_type` (enum): Operation type - "add", "edit", or "delete"

**Conditional Parameters (Required for "add"):**
- `name` (string): Name of the person
- `contact_no` (number): Contact number
- `house_no_building` (string): House number or building name
- `street_name` (string): Street name
- `area` (string): Area name
- `city` (string): City name
- `state` (enum): State name
- `pincode` (enum): Pincode (6 digits)

**Conditional Parameters (Required for "edit" and "delete"):**
- `address_id` (string): Unique address identifier

**Optional Parameters:**
- `default_status` (boolean): Set as default address (true/false)

#### Request Examples

**Add New Address**
```json
{
  "user_id": "user@example.com",
  "hit_type": "add",
  "name": "Jishan",
  "contact_no": "9876543210",
  "house_no_building": "123, ABC Building",
  "street_name": "Main Street",
  "area": "Downtown",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "default_status": "true"
}
```

**Edit Existing Address**
```json
{
  "user_id": "user@example.com",
  "hit_type": "edit",
  "address_id": "ADDR12345678",
  "name": "Jishan Kumar",
  "contact_no": "9876543210",
  "default_status": "true"
}
```

**Delete Address**
```json
{
  "user_id": "user@example.com",
  "hit_type": "delete",
  "address_id": "ADDR12345678"
}
```

#### Response Examples

**Success - Address Added**
```json
{
  "status": true,
  "message": "New Address added successfully"
}
```

**Success - Address Updated**
```json
{
  "status": true,
  "message": "Address updated successfully"
}
```

**Success - Default Address Updated**
```json
{
  "status": true,
  "message": "Default address updated successfully"
}
```

**Success - Address Deleted**
```json
{
  "status": true,
  "message": "Address deleted successfully"
}
```

**Error - Address Not Found**
```json
{
  "status": false,
  "error_type": "invalid_address",
  "message": "Provided address id does not exist."
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

### 2. Get All Addresses
**Endpoint**: `GET /api/v1/user-address/:user_id`  
**Authentication**: No authentication required  
**Description**: Retrieve all addresses for a user

#### Response
```json
{
  "status": true,
  "message": "Address book retrieved successfully",
  "data": {
    "addresses": [
      {
        "address_id": "ADDR12345678",
        "name": "Jishan",
        "contact_no": "9876543210",
        "house_no_or_building": "123, ABC Building",
        "road_or_area": "Main Street",
        "area": "Downtown",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400001",
        "default": true,
        "created_at": "2025-01-16T10:00:00Z",
        "updated_at": "2025-01-16T10:00:00Z"
      }
    ],
    "total_addresses": 1
  }
}
```

### 3. Get Specific Address
**Endpoint**: `GET /api/v1/user-address/:user_id/:address_id`  
**Authentication**: No authentication required  
**Description**: Retrieve a specific address

#### Response
```json
{
  "status": true,
  "message": "Address retrieved successfully",
  "data": {
    "address_id": "ADDR12345678",
    "name": "Jishan",
    "contact_no": "9876543210",
    "house_no_or_building": "123, ABC Building",
    "road_or_area": "Main Street",
    "area": "Downtown",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "default": true,
    "created_at": "2025-01-16T10:00:00Z",
    "updated_at": "2025-01-16T10:00:00Z"
  }
}
```

## Field Validation Rules

### Required Fields (for "add" operation)
- **user_id**: Valid email or phone number
- **hit_type**: Must be "add", "edit", or "delete"
- **name**: 1-100 characters, letters and spaces only
- **contact_no**: 10-15 characters, digits with optional formatting
- **house_no_building**: 1-200 characters
- **street_name**: 1-200 characters
- **area**: 1-100 characters
- **city**: 1-100 characters, letters and spaces only
- **state**: 1-100 characters, letters and spaces only
- **pincode**: Exactly 6 digits

### Optional Fields
- **address_id**: Required for "edit" and "delete" operations
- **default_status**: Boolean (true/false) or string ("true"/"false")

### Validation Rules
- **Names**: Letters and spaces only, 1-100 characters
- **Contact Number**: Digits, spaces, hyphens, parentheses, 10-15 characters
- **Address Fields**: 1-200 characters for building/street, 1-100 for area/city/state
- **Pincode**: Exactly 6 digits
- **Default Status**: Boolean or string representation

## Business Logic

### Add Operation (hit_type: "add")
1. **Validation**: Validate all required fields
2. **Address ID Generation**: Generate unique address ID (ADDR + 8 hex characters)
3. **Default Address Handling**: If default_status is true, unset current default
4. **Address Creation**: Create new address object
5. **Database Update**: Add address to user's address_book array
6. **Response**: Return success message

### Edit Operation (hit_type: "edit")
1. **Validation**: Validate address_id and user_id
2. **Address Lookup**: Find existing address by address_id
3. **Field Updates**: Update only provided fields
4. **Default Address Handling**: Handle default status changes
5. **Database Update**: Update address in user's address_book array
6. **Response**: Return appropriate success message

### Delete Operation (hit_type: "delete")
1. **Validation**: Validate address_id and user_id
2. **Address Lookup**: Find existing address by address_id
3. **Address Removal**: Remove address from user's address_book array
4. **Database Update**: Save updated user document
5. **Response**: Return success message

### Default Address Management
- **Single Default**: Only one address can be marked as default
- **Auto-Unset**: When setting a new default, previous default is automatically unset
- **No Impact**: If address is already default, no changes occur
- **Validation**: Ensures data integrity for default address logic

### Address ID Generation
- Format: "ADDR" + 8 hexadecimal characters (uppercase)
- Example: "ADDR12345678", "ADDRABCDEF12"
- Generated using crypto.randomBytes(4).toString('hex').toUpperCase()

## Error Handling

### Validation Errors
- Missing required fields
- Invalid field formats
- Invalid hit_type values
- Missing address_id for edit/delete operations

### Business Logic Errors
- User not found
- Address not found
- Invalid default status values

### Server Errors
- Database connection issues
- Internal processing errors

## Security Considerations

1. **Input Validation**: Comprehensive validation on all inputs
2. **Data Sanitization**: Trim whitespace and normalize data
3. **User Verification**: Verify user exists and is active
4. **Address Isolation**: Users can only access their own addresses
5. **No Authentication**: As per requirements, but consider rate limiting

## Database Schema

### User Model - Address Book Array
```javascript
address_book: [{
  address_id: String,        // Unique address identifier
  name: String,              // Person's name
  contact_no: String,        // Contact number
  house_no_or_building: String, // House number or building
  road_or_area: String,      // Street name
  area: String,              // Area name
  city: String,              // City name
  state: String,             // State name
  pincode: String,           // Pincode (6 digits)
  default: Boolean,          // Default address flag
  created_at: Date,          // Creation timestamp
  updated_at: Date           // Last update timestamp
}]
```

## Testing

### Test Cases
1. **Add Address**: Test adding new address
2. **Edit Address**: Test updating existing address
3. **Delete Address**: Test removing address
4. **Default Address**: Test default address management
5. **Get All Addresses**: Test retrieving all addresses
6. **Get Specific Address**: Test retrieving single address
7. **Validation Errors**: Test with invalid inputs
8. **Address Not Found**: Test with non-existent address_id

### Sample Test Data
```json
{
  "user_id": "test@example.com",
  "hit_type": "add",
  "name": "Test User",
  "contact_no": "9876543210",
  "house_no_building": "123 Test Building",
  "street_name": "Test Street",
  "area": "Test Area",
  "city": "Test City",
  "state": "Test State",
  "pincode": "123456",
  "default_status": "true"
}
```

## Integration Notes

### Database Integration
- Updates existing User model
- Maintains data integrity
- Preserves existing relationships
- Automatic timestamp management

### Validation Integration
- Uses express-validator middleware
- Conditional validation based on hit_type
- Comprehensive field validation
- Custom validation rules

### Error Handling Integration
- Consistent error response format
- Appropriate HTTP status codes
- Detailed error messages
- Error type categorization

## Performance Considerations

1. **Database Queries**: Optimized user lookup and updates
2. **Validation Efficiency**: Early validation to prevent unnecessary processing
3. **Response Optimization**: Minimal data transfer in responses
4. **Array Operations**: Efficient array manipulation for address management

## Future Enhancements

1. **Bulk Operations**: Support for adding/updating multiple addresses
2. **Address Validation**: Integration with postal service APIs
3. **Geocoding**: Add latitude/longitude coordinates
4. **Address Categories**: Support for different address types (home, office, etc.)
5. **Import/Export**: CSV import/export functionality
6. **Address Sharing**: Share addresses between users
7. **Advanced Search**: Search addresses by location, type, etc.
8. **Address History**: Track address changes over time
9. **Map Integration**: Display addresses on maps
10. **Delivery Integration**: Integration with delivery services
