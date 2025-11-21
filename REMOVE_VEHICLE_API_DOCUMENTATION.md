# 🚗 Remove Vehicle from Garage API Documentation

## 🌟 Overview
This endpoint allows users to remove a vehicle from their garage by providing the user ID and vehicle number. The API validates the input, checks for user existence, and removes the specified vehicle from the user's garage collection.

## 🔗 Endpoint
```
POST https://digivahan.in/api/v1/garage/remove-vehicle
```

## 🔐 Authentication
**No Authentication Required** - This is a public API endpoint.

## 🌐 HTTP Method
**POST**

## 📌 Request Parameters
The following parameters should be included in the request body:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | string | Yes | Unique ID of the user |
| `vehicle_number` | string | Yes | Vehicle number provided by RTO (e.g., "DL5CA1234") |

## 📤 Request Example

```json
{
  "user_id": "user_98765",
  "vehicle_number": "DL5CA1234"
}
```

## 📥 Response Examples

### ✅ Success Response
```json
{
  "status": true,
  "message": "Vehicle successfully removed from your garage.",
  "data": {
    "vehicle_number": "DL5CA1234"
  }
}
```

### ❌ Error Responses

#### User Not Found
```json
{
  "status": false,
  "error_type": "userId",
  "message": "User not found."
}
```

#### Vehicle Not Found in Garage
```json
{
  "status": false,
  "error_type": "other",
  "message": "No such vehicle found in user garage."
}
```

#### Invalid Parameter
```json
{
  "status": false,
  "error_type": "Invalid parameter",
  "message": "You have entered invalid parameter"
}
```

#### Invalid Vehicle Number Format
```json
{
  "status": false,
  "error_type": "Invalid parameter",
  "message": "The vehicle number you have entered is invalid"
}
```

## 🧠 Backend Logic

### Process Flow
1. **Input Validation**: Validate that both `user_id` and `vehicle_number` are provided
2. **Vehicle Number Format**: Validate vehicle number format (e.g., DL5CA1234)
3. **User Verification**: Check if user exists in the database
4. **Garage Check**: Verify user has a garage with vehicles
5. **Vehicle Search**: Find the specific vehicle in user's garage
6. **Vehicle Removal**: Remove the vehicle from the garage collection
7. **Database Update**: Save the updated garage data
8. **Response**: Return success confirmation with vehicle number

### Database Operations
- **Query**: Find user by `user_id`
- **Search**: Locate vehicle in `user.garage.vehicles` array
- **Delete**: Remove vehicle object from the array
- **Update**: Save updated user document

## 🔧 Technical Implementation

### Validation Rules
- **user_id**: Required, must be a valid MongoDB ObjectId or user identifier
- **vehicle_number**: Required, must match pattern `^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$`

### Error Types
- **"userId"**: User-related errors (user not found)
- **"other"**: General errors (vehicle not found, server errors)
- **"Invalid parameter"**: Input validation errors

### HTTP Status Codes
- **200**: Success - Vehicle removed successfully
- **400**: Bad Request - Invalid parameters or vehicle number format
- **404**: Not Found - User not found or vehicle not in garage
- **500**: Internal Server Error - Server-side errors

## 📝 Usage Examples

### cURL Example
```bash
curl -X POST https://digivahan.in/api/v1/garage/remove-vehicle \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_98765",
    "vehicle_number": "DL5CA1234"
  }'
```

### JavaScript Example
```javascript
const removeVehicle = async (userId, vehicleNumber) => {
  try {
    const response = await fetch('https://digivahan.in/api/v1/garage/remove-vehicle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        vehicle_number: vehicleNumber
      })
    });

    const result = await response.json();
    
    if (result.status) {
      console.log('Vehicle removed successfully:', result.data.vehicle_number);
    } else {
      console.error('Error:', result.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};

// Usage
removeVehicle('user_98765', 'DL5CA1234');
```

### Python Example
```python
import requests
import json

def remove_vehicle(user_id, vehicle_number):
    url = "https://digivahan.in/api/v1/garage/remove-vehicle"
    
    payload = {
        "user_id": user_id,
        "vehicle_number": vehicle_number
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, headers=headers, data=json.dumps(payload))
        result = response.json()
        
        if result["status"]:
            print(f"Vehicle removed successfully: {result['data']['vehicle_number']}")
        else:
            print(f"Error: {result['message']}")
            
    except requests.exceptions.RequestException as e:
        print(f"Network error: {e}")

# Usage
remove_vehicle("user_98765", "DL5CA1234")
```

## 🚀 Features

- ✅ **Input Validation**: Comprehensive parameter validation
- ✅ **Vehicle Number Format**: Validates RTO vehicle number format
- ✅ **User Verification**: Checks user existence before processing
- ✅ **Garage Management**: Safely removes vehicles from garage
- ✅ **Error Handling**: Detailed error responses with error types
- ✅ **Database Safety**: Atomic operations with proper error handling
- ✅ **No Authentication**: Public API for easy integration

## 🔒 Security Considerations

- **Input Sanitization**: All inputs are validated and sanitized
- **SQL Injection Prevention**: Uses parameterized queries
- **Error Information**: Limited error details to prevent information leakage
- **Rate Limiting**: Can be implemented at the server level
- **Data Validation**: Strict format validation for vehicle numbers

## 📊 Performance

- **Efficient Queries**: Direct user lookup by ID
- **Array Operations**: Fast vehicle removal from garage array
- **Minimal Data Transfer**: Only returns necessary confirmation data
- **Database Optimization**: Uses indexed user ID for fast lookups

## 🔄 Database Schema Impact

### User Document Structure
```javascript
{
  _id: ObjectId,
  // ... other user fields
  garage: {
    security_code: String,
    vehicles: [
      {
        vehicle_id: String,
        vehicle_info: {
          vehicle_number: String,
          // ... other vehicle details
        },
        // ... other vehicle fields
      }
      // Vehicle to be removed is deleted from this array
    ]
  }
}
```

### Operations Performed
1. **Find**: `User.findById(user_id)`
2. **Search**: `user.garage.vehicles.findIndex(vehicle => vehicle.vehicle_info.vehicle_number === vehicle_number)`
3. **Remove**: `user.garage.vehicles.splice(vehicleIndex, 1)`
4. **Save**: `user.save()`

## 🎯 Error Scenarios

### 1. Missing Parameters
- **Trigger**: When `user_id` or `vehicle_number` is not provided
- **Response**: 400 Bad Request with "Invalid parameter" error type

### 2. Invalid Vehicle Number Format
- **Trigger**: When vehicle number doesn't match RTO format
- **Response**: 400 Bad Request with "Invalid parameter" error type

### 3. User Not Found
- **Trigger**: When `user_id` doesn't exist in database
- **Response**: 404 Not Found with "userId" error type

### 4. Empty Garage
- **Trigger**: When user has no garage or no vehicles
- **Response**: 404 Not Found with "other" error type

### 5. Vehicle Not in Garage
- **Trigger**: When vehicle number doesn't exist in user's garage
- **Response**: 404 Not Found with "other" error type

### 6. Server Errors
- **Trigger**: Database connection issues or server errors
- **Response**: 500 Internal Server Error with "other" error type

## 🧪 Testing

### Test Cases
1. **Valid Request**: Should return success with vehicle number
2. **Missing user_id**: Should return 400 with "Invalid parameter"
3. **Missing vehicle_number**: Should return 400 with "Invalid parameter"
4. **Invalid vehicle format**: Should return 400 with "Invalid parameter"
5. **Non-existent user**: Should return 404 with "userId" error type
6. **Empty garage**: Should return 404 with "other" error type
7. **Vehicle not in garage**: Should return 404 with "other" error type

### Sample Test Data
```json
{
  "valid_user_id": "507f1f77bcf86cd799439011",
  "valid_vehicle_number": "DL5CA1234",
  "invalid_vehicle_number": "INVALID123",
  "non_existent_user": "507f1f77bcf86cd799439999"
}
```

## 🔧 Integration Notes

### Frontend Integration
- Handle success response to update UI
- Display appropriate error messages based on error_type
- Implement loading states during API calls
- Validate vehicle number format on client side

### Backend Integration
- Ensure user exists before calling this API
- Handle network errors gracefully
- Implement retry logic for failed requests
- Log successful removals for audit purposes

## 📞 Support

For issues with the Remove Vehicle API:
1. Verify vehicle number format (e.g., DL5CA1234)
2. Ensure user exists in the system
3. Check if vehicle exists in user's garage
4. Review request payload format
5. Check server logs for detailed error information

## 🎉 Success!

This API provides a clean and efficient way to remove vehicles from user garages with comprehensive error handling and validation. The response format is consistent and provides clear feedback for both success and error scenarios.

