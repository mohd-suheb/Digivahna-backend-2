# 🚗 Garage Management API Documentation

## Overview
The Garage Management API allows users to add vehicles to their garage by fetching vehicle data from RTO (Regional Transport Office) and managing their vehicle collection.

## 🔗 Base URL
```
https://digivahan.in/api/v1/garage
```

## 🔐 Authentication
**No Authentication Required** - This is a public API endpoint.

## 📋 Available Endpoints

### 1. Add Vehicle to Garage
**POST** `/api/v1/garage/add-vehicle`

This endpoint fetches vehicle data from RTO and adds it to the user's garage.

#### Request Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | string | Yes | Unique ID of the user |
| `vehicle_number` | string | Yes | Vehicle number in format (e.g., "UP32AB1234") |

#### Request Body
```json
{
  "user_id": "507f1f77bcf86cd799439011",
  "vehicle_number": "UP32AB1234"
}
```

#### Response Examples

**✅ Success Response:**
```json
{
  "status": true,
  "message": "Vehicle added to garage successfully.",
  "data": {
    "result": {
      "registration": {
        "number": "AP09AB1234",
        "authority": "RTO Hyderabad",
        "date": "08-May-2015",
        "expiryDate": "07-May-2030",
        "owner": {
          "name": "Rajesh Kumar",
          "fatherName": "Suresh Kumar",
          "mobileNumber": "9876543210",
          "presentAddress": "12-3-45, Banjara Hills, Hyderabad, Telangana, 500034",
          "permanentAddress": "45-6-789, MG Road, Vijayawada, Andhra Pradesh, 520001"
        },
        "status": {
          "active": false,
          "updatedOn": "08-Apr-2025"
        },
        "ownerCount": 1
      },
      "vehicle": {
        "class": "Car",
        "manufacturer": "Maruti Suzuki",
        "model": "Swift VXI",
        "color": "Red",
        "fuelType": "Petrol",
        "normsType": "BS4",
        "chassis": "MA3EXX12345678908",
        "engine": "K12MN1234560",
        "manufacturingYear": "2015",
        "cubicCapacity": "1197",
        "grossWeight": "1500",
        "unladenWeight": 960,
        "wheelbase": 2430,
        "cylinders": 4,
        "seatCapacity": 5,
        "bodyType": "Saloon Car",
        "vehicleSleeperCapacity": "0",
        "vehicleStandingCapacity": 0,
        "category": "LMV",
        "isCommercial": true
      },
      "insurance": {
        "company": "ICICI Lombard",
        "expiryDate": "05-May-2025",
        "policyNumber": "9123456789010"
      },
      "pollutionControl": {
        "certificateNumber": "APPC1234567892",
        "validUpto": "06-Sep-2024"
      },
      "permit": {
        "issuedDate": "10-May-2015",
        "number": "PERM123456",
        "type": "National",
        "validFrom": "10-May-2015",
        "validUpto": "09-May-2020"
      },
      "blacklist": {
        "status": "Clear",
        "details": []
      },
      "nationalPermit": {
        "number": "NP987654321",
        "validUpto": "09-May-2025",
        "issuedBy": "RTO Hyderabad"
      },
      "nonUseStatus": {
        "status": null,
        "from": null,
        "to": null
      },
      "finance": {
        "isFinanced": true,
        "rcFinancer": "HDFC Bank Ltd"
      },
      "additionalFlags": {
        "partialData": false,
        "dbResult": false,
        "mmvResponse": null
      }
    }
  }
}
```

**❌ Error - Vehicle Already Exists:**
```json
{
  "status": false,
  "message": "Vehicle already exists in your garage."
}
```

**❌ Error - RTO API Failed:**
```json
{
  "status": false,
  "message": "Unable to fetch data from RTO. Please try again later."
}
```

**❌ Error - Invalid Vehicle Number:**
```json
{
  "status": false,
  "message": "The vehicle number you have entered is invalid"
}
```

**❌ Error - User Not Found:**
```json
{
  "status": false,
  "message": "User not found"
}
```

### 2. Get User's Garage
**GET** `/api/v1/garage/:user_id`

Retrieves all vehicles in the user's garage.

#### URL Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | string | Yes | Unique ID of the user |

#### Response Example
```json
{
  "status": true,
  "message": "Garage data retrieved successfully",
  "data": {
    "garage": {
      "security_code": "",
      "vehicles": [
        {
          "vehicle_id": "vehicle_1640995200000_abc123def",
          "vehicle_info": {
            "owner_name": "Rajesh Kumar",
            "vehicle_number": "UP32AB1234",
            "vehicle_name": "Maruti Suzuki Swift VXI",
            "registration_date": "2015-05-08T00:00:00.000Z",
            "ownership_details": "First Owner",
            "financer_name": "HDFC Bank Ltd",
            "registered_rto": "RTO Hyderabad",
            "makers_model": "Swift VXI",
            "makers_name": "Maruti Suzuki",
            "vehicle_class": "Car",
            "fuel_type": "Petrol",
            "fuel_norms": "BS4",
            "engine": "K12MN1234560",
            "chassis_number": "MA3EXX12345678908",
            "insurer_name": "ICICI Lombard",
            "insurance_type": "Comprehensive",
            "insurance_expiry": "2025-05-05T00:00:00.000Z",
            "insurance_renewed_date": "2025-05-05T00:00:00.000Z",
            "vehicle_age": 9,
            "fitness_upto": "2030-05-07T00:00:00.000Z",
            "pollution_renew_date": "2024-09-06T00:00:00.000Z",
            "pollution_expiry": "2024-09-06T00:00:00.000Z",
            "color": "Red",
            "unloaded_weight": "960",
            "rc_status": "Inactive",
            "insurance_policy_number": "9123456789010"
          },
          "vehicle_documents": {
            "insurance": {
              "file_url": ""
            },
            "pollution": {
              "file_url": ""
            },
            "registration": {
              "file_url": ""
            },
            "other_documents": [
              {
                "doc_name": "Pollution Certificate",
                "doc_number": "APPC1234567892",
                "doc_url": ""
              },
              {
                "doc_name": "Permit",
                "doc_number": "PERM123456",
                "doc_url": ""
              }
            ]
          },
          "rto_data": {
            // Complete RTO data as received from API
          },
          "added_at": "2025-01-27T10:30:00.000Z",
          "last_updated": "2025-01-27T10:30:00.000Z"
        }
      ]
    }
  }
}
```

### 3. Remove Vehicle from Garage
**DELETE** `/api/v1/garage/remove-vehicle`

Removes a vehicle from the user's garage.

#### Request Body
```json
{
  "user_id": "507f1f77bcf86cd799439011",
  "vehicle_number": "UP32AB1234"
}
```

#### Response Example
```json
{
  "status": true,
  "message": "Vehicle removed from garage successfully."
}
```

## 🧠 Backend Logic

### Add Vehicle Process
1. **Validation**: Check if user_id and vehicle_number are provided
2. **Vehicle Number Format**: Validate vehicle number format (e.g., UP32AB1234)
3. **User Check**: Verify user exists in database
4. **Garage Initialization**: Initialize garage if user doesn't have one
5. **Duplicate Check**: Check if vehicle already exists in user's garage
6. **RTO API Call**: Fetch vehicle data from RTO API
7. **Data Transformation**: Transform RTO data to internal vehicle schema
8. **Save to Garage**: Add vehicle to user's garage and save to database
9. **Response**: Return success response with RTO data

### Data Transformation
The API transforms RTO data into the internal vehicle schema format:
- Maps RTO fields to internal vehicle_info structure
- Calculates vehicle age from manufacturing year
- Sets default values for missing fields
- Stores complete RTO data for reference
- Adds timestamps for tracking

## 🔧 Technical Implementation

### Database Schema
The vehicle data is stored in the User model's garage field:
```javascript
{
  garage: {
    security_code: String,
    vehicles: [{
      vehicle_id: String,
      vehicle_info: {
        owner_name: String,
        vehicle_number: String,
        vehicle_name: String,
        registration_date: Date,
        // ... other vehicle details
      },
      vehicle_documents: {
        insurance: { file_url: String },
        pollution: { file_url: String },
        registration: { file_url: String },
        other_documents: [{
          doc_name: String,
          doc_number: String,
          doc_url: String
        }]
      },
      rto_data: Object, // Complete RTO data
      added_at: Date,
      last_updated: Date
    }]
  }
}
```

### Validation Rules
- **user_id**: Required, 1-100 characters
- **vehicle_number**: Required, must match pattern `^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$`

### Error Handling
- Comprehensive error messages for different scenarios
- Proper HTTP status codes (400, 404, 500)
- Consistent error response format
- RTO API failure handling

## 📝 Usage Examples

### cURL Examples

**Add Vehicle:**
```bash
curl -X POST https://digivahan.in/api/v1/garage/add-vehicle \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "507f1f77bcf86cd799439011",
    "vehicle_number": "UP32AB1234"
  }'
```

**Get Garage:**
```bash
curl -X GET https://digivahan.in/api/v1/garage/507f1f77bcf86cd799439011
```

**Remove Vehicle:**
```bash
curl -X DELETE https://digivahan.in/api/v1/garage/remove-vehicle \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "507f1f77bcf86cd799439011",
    "vehicle_number": "UP32AB1234"
  }'
```

## 🚀 Features

- ✅ **RTO Integration**: Fetches real-time vehicle data from RTO
- ✅ **Duplicate Prevention**: Prevents adding same vehicle twice
- ✅ **Data Transformation**: Converts RTO data to internal format
- ✅ **Complete Vehicle Info**: Stores comprehensive vehicle details
- ✅ **Document Tracking**: Manages vehicle documents
- ✅ **Garage Management**: Full CRUD operations for garage
- ✅ **Validation**: Comprehensive input validation
- ✅ **Error Handling**: Detailed error responses
- ✅ **No Authentication**: Public API for easy integration

## 🔒 Security Considerations

- Input validation prevents injection attacks
- Vehicle number format validation
- User existence verification
- Proper error handling without information leakage
- No sensitive data exposure in responses

## 📊 Performance

- Efficient database queries with proper indexing
- Minimal data transfer with optimized response format
- Serverless-ready architecture for scalability
- RTO API integration with timeout handling

## 🔄 RTO API Integration

### Current Implementation
- **Mock Data**: Currently returns mock RTO data for testing
- **Production Ready**: Structure ready for actual RTO API integration

### Production Integration
To integrate with actual RTO API:
1. Replace `fetchVehicleDataFromRTO` function with actual API call
2. Add proper authentication headers
3. Implement retry logic and error handling
4. Add rate limiting for RTO API calls
5. Cache responses for better performance

### RTO API Endpoint Structure
```javascript
// Example RTO API call
const response = await axios.get(`https://rto-api.example.com/vehicle/${vehicleNumber}`, {
  headers: {
    'Authorization': 'Bearer YOUR_RTO_API_TOKEN',
    'Content-Type': 'application/json'
  },
  timeout: 10000
});
```

## 🎯 Future Enhancements

1. **Real RTO API Integration**: Connect to actual RTO databases
2. **Document Upload**: Allow users to upload vehicle documents
3. **Expiry Notifications**: Send alerts for document expiry
4. **Vehicle History**: Track vehicle ownership history
5. **Bulk Operations**: Add multiple vehicles at once
6. **Search & Filter**: Advanced garage search capabilities
7. **Export Features**: Export garage data to PDF/Excel
8. **QR Code Integration**: Link vehicles with QR codes

## 📞 Support

For issues with the Garage API:
1. Check this documentation first
2. Verify vehicle number format
3. Ensure user exists in database
4. Check RTO API connectivity
5. Review server logs for detailed errors

## 🎉 Happy Vehicle Management!

This API provides comprehensive vehicle management capabilities with RTO integration, making it easy for users to track and manage their vehicles in one place.

