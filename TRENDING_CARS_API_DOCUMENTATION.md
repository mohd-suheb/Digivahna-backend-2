# 🚘 Trending Cars List API Documentation

## 🌟 Overview
This endpoint allows users to manipulate the Trending Cars list in the common database. Users can add new cars, delete existing cars, and fetch the complete list of trending cars.

## 🔗 Endpoint
```
POST https://digivahan.in/api/user/trending-cars
```

## 🔐 Authentication
**No Authentication Required** - This is a public API endpoint.

## 🌐 HTTP Method
**POST**

## 📌 Request Parameters
The request behavior depends on the `hit_type` parameter:

### Case 1: Add New Car (`hit_type: "add"`)
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `hit_type` | string | Yes | Must be "add" |
| `brand_name` | string | Yes | Car brand name (e.g., "Hyundai") |
| `model_name` | string | Yes | Car model name (e.g., "Tucson") |
| `type` | string | Yes | Car type (e.g., "Premium Midsize SUV") |
| `price` | number | Yes | Car price in numeric format |
| `price_display` | string | Yes | Formatted price display |
| `mileage` | string | Yes | Car mileage |
| `top_speed` | string | Yes | Car top speed |
| `image_url` | string | Yes | Car image URL |
| `specifications` | object | Yes | Basic car specifications |
| `detailed_specifications` | object | Yes | Detailed car specifications |
| `dimensions` | object | Yes | Car dimensions |
| `features` | object | Yes | Car features and amenities |

### Case 2: Delete Car (`hit_type: "delete"`)
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `hit_type` | string | Yes | Must be "delete" |
| `car_id` | string | Yes | Unique car identifier |

### Case 3: Fetch Cars (`hit_type: "fetch"`)
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `hit_type` | string | Yes | Must be "fetch" |

## 📤 Request Examples

### Add New Car
```json
{
  "hit_type": "add",
  "brand_name": "Hyundai",
  "model_name": "Tucson",
  "type": "Premium Midsize SUV",
  "price": 2927000,
  "price_display": "₹29.27 Lakh onwards",
  "mileage": "35 kmpl",
  "top_speed": "212 km/h",
  "image_url": "https://example.com/images/tucson_blue.png",
  "specifications": {
    "engine_capacity": "1997 cc",
    "transmission": "Automatic (AMT)",
    "fuel_tank_capacity": "37 Liters",
    "seat_height": "450 mm",
    "kerb_weight": "1750 kg"
  },
  "detailed_specifications": {
    "max_power": "89 bhp",
    "max_torque": "120 Nm",
    "riding_mode": "Eco, Normal, Sport",
    "gear_shifting_pattern": "6-speed automatic"
  },
  "dimensions": {
    "bootspace": "420 Liters",
    "ground_clearance": "163 mm",
    "length": "3999 mm",
    "width": "1735 mm",
    "height": "1525 mm"
  },
  "features": {
    "air_conditioner": true,
    "central_locking": "Keyless",
    "power_windows": "Front & Rear",
    "headrest": "Front & Rear",
    "parking_assist": "Reverse Camera with Guidance",
    "cruise_control": true,
    "music_system_count": 1,
    "apple_carplay": "Wireless",
    "android_auto": "Wireless",
    "abs": true,
    "sunroof": false,
    "third_row_ac": false,
    "airbags": [
      "Driver",
      "Front Passenger",
      "Curtain",
      "Side",
      "Rear Passenger"
    ]
  }
}
```

### Delete Car
```json
{
  "hit_type": "delete",
  "car_id": "car_001"
}
```

### Fetch All Cars
```json
{
  "hit_type": "fetch"
}
```

## 📥 Response Examples

### ✅ Success Responses

#### Add Car Success
```json
{
  "status": true,
  "message": "Trending cars added successfully"
}
```

#### Delete Car Success
```json
{
  "status": true,
  "message": "Trending cars Deleted successfully"
}
```

#### Fetch Cars Success
```json
{
  "status": true,
  "message": "Trending cars fetched successfully",
  "data": {
    "cars": [
      {
        "car_id": "car_12345",
        "brand_name": "Hyundai",
        "model_name": "Tucson",
        "type": "Premium Midsize SUV",
        "price": 2927000,
        "price_display": "₹29.27 Lakh onwards",
        "mileage": "35 kmpl",
        "top_speed": "212 km/h",
        "image_url": "https://example.com/images/tucson_blue.png",
        "specifications": {
          "engine_capacity": "1997 cc",
          "transmission": "Automatic (AMT)",
          "fuel_tank_capacity": "37 Liters",
          "seat_height": "450 mm",
          "kerb_weight": "1750 kg"
        },
        "detailed_specifications": {
          "max_power": "89 bhp",
          "max_torque": "120 Nm",
          "riding_mode": "Eco, Normal, Sport",
          "gear_shifting_pattern": "6-speed automatic"
        },
        "dimensions": {
          "bootspace": "420 Liters",
          "ground_clearance": "163 mm",
          "length": "3999 mm",
          "width": "1735 mm",
          "height": "1525 mm"
        },
        "features": {
          "air_conditioner": true,
          "central_locking": "Keyless",
          "power_windows": "Front & Rear",
          "headrest": "Front & Rear",
          "parking_assist": "Reverse Camera with Guidance",
          "cruise_control": true,
          "music_system_count": 1,
          "apple_carplay": "Wireless",
          "android_auto": "Wireless",
          "abs": true,
          "sunroof": false,
          "third_row_ac": false,
          "airbags": [
            "Driver",
            "Front Passenger",
            "Curtain",
            "Side",
            "Rear Passenger"
          ]
        },
        "created_at": "2025-01-27T10:30:00.000Z",
        "updated_at": "2025-01-27T10:30:00.000Z"
      }
    ],
    "total_count": 1
  }
}
```

### ❌ Error Responses

#### Invalid ID (Car Not Found)
```json
{
  "status": false,
  "error_type": "invalid_id",
  "message": "car id does not exist"
}
```

#### Server Issue
```json
{
  "status": false,
  "error_type": "other",
  "message": "server not working."
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

## 🧠 Backend Logic

### Add Car Process
1. **Validation**: Check if `hit_type` is "add" and all required fields are present
2. **Field Validation**: Validate all nested objects and their required fields
3. **Data Validation**: Validate price (positive number) and other numeric fields
4. **Car ID Generation**: Generate unique `car_id` in format `car_XXXXX`
5. **Database Save**: Save car data to TrendingCars collection
6. **Response**: Return success confirmation

### Delete Car Process
1. **Validation**: Check if `hit_type` is "delete" and `car_id` is provided
2. **Car Existence**: Verify car exists in database
3. **Deletion**: Remove car from TrendingCars collection
4. **Response**: Return success confirmation

### Fetch Cars Process
1. **Validation**: Check if `hit_type` is "fetch"
2. **Database Query**: Retrieve all cars from TrendingCars collection
3. **Sorting**: Sort by creation date (newest first)
4. **Response**: Return complete car list with count

## 🔧 Technical Implementation

### Database Schema
```javascript
{
  car_id: String,           // Unique identifier (car_XXXXX)
  brand_name: String,       // Car brand
  model_name: String,       // Car model
  type: String,             // Car type/category
  price: Number,            // Numeric price
  price_display: String,    // Formatted price
  mileage: String,          // Mileage information
  top_speed: String,        // Top speed
  image_url: String,        // Car image URL
  specifications: {         // Basic specifications
    engine_capacity: String,
    transmission: String,
    fuel_tank_capacity: String,
    seat_height: String,
    kerb_weight: String
  },
  detailed_specifications: { // Detailed specifications
    max_power: String,
    max_torque: String,
    riding_mode: String,
    gear_shifting_pattern: String
  },
  dimensions: {             // Car dimensions
    bootspace: String,
    ground_clearance: String,
    length: String,
    width: String,
    height: String
  },
  features: {               // Car features
    air_conditioner: Boolean,
    central_locking: String,
    power_windows: String,
    headrest: String,
    parking_assist: String,
    cruise_control: Boolean,
    music_system_count: Number,
    apple_carplay: String,
    android_auto: String,
    abs: Boolean,
    sunroof: Boolean,
    third_row_ac: Boolean,
    airbags: [String]       // Array of airbag types
  },
  created_at: Date,         // Creation timestamp
  updated_at: Date          // Last update timestamp
}
```

### Validation Rules
- **hit_type**: Required, must be "add", "delete", or "fetch"
- **car_id**: Required for delete operation, 1-50 characters
- **price**: Required for add operation, must be positive number
- **music_system_count**: Required for add operation, must be non-negative number
- **airbags**: Required for add operation, must be non-empty array

### Error Types
- **"invalid_id"**: Car ID does not exist
- **"other"**: Server errors and general issues
- **"Invalid parameter"**: Input validation errors

## 📝 Usage Examples

### cURL Examples

#### Add New Car
```bash
curl -X POST https://digivahan.in/api/user/trending-cars \
  -H "Content-Type: application/json" \
  -d '{
    "hit_type": "add",
    "brand_name": "Hyundai",
    "model_name": "Tucson",
    "type": "Premium Midsize SUV",
    "price": 2927000,
    "price_display": "₹29.27 Lakh onwards",
    "mileage": "35 kmpl",
    "top_speed": "212 km/h",
    "image_url": "https://example.com/images/tucson_blue.png",
    "specifications": {
      "engine_capacity": "1997 cc",
      "transmission": "Automatic (AMT)",
      "fuel_tank_capacity": "37 Liters",
      "seat_height": "450 mm",
      "kerb_weight": "1750 kg"
    },
    "detailed_specifications": {
      "max_power": "89 bhp",
      "max_torque": "120 Nm",
      "riding_mode": "Eco, Normal, Sport",
      "gear_shifting_pattern": "6-speed automatic"
    },
    "dimensions": {
      "bootspace": "420 Liters",
      "ground_clearance": "163 mm",
      "length": "3999 mm",
      "width": "1735 mm",
      "height": "1525 mm"
    },
    "features": {
      "air_conditioner": true,
      "central_locking": "Keyless",
      "power_windows": "Front & Rear",
      "headrest": "Front & Rear",
      "parking_assist": "Reverse Camera with Guidance",
      "cruise_control": true,
      "music_system_count": 1,
      "apple_carplay": "Wireless",
      "android_auto": "Wireless",
      "abs": true,
      "sunroof": false,
      "third_row_ac": false,
      "airbags": ["Driver", "Front Passenger", "Curtain", "Side", "Rear Passenger"]
    }
  }'
```

#### Delete Car
```bash
curl -X POST https://digivahan.in/api/user/trending-cars \
  -H "Content-Type: application/json" \
  -d '{
    "hit_type": "delete",
    "car_id": "car_001"
  }'
```

#### Fetch All Cars
```bash
curl -X POST https://digivahan.in/api/user/trending-cars \
  -H "Content-Type: application/json" \
  -d '{
    "hit_type": "fetch"
  }'
```

### JavaScript Example
```javascript
const manageTrendingCars = async (operation, data = {}) => {
  try {
    const response = await fetch('https://digivahan.in/api/user/trending-cars', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hit_type: operation,
        ...data
      })
    });

    const result = await response.json();
    
    if (result.status) {
      console.log('Success:', result.message);
      return result.data;
    } else {
      console.error('Error:', result.message);
      return null;
    }
  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
};

// Usage examples
// Add a new car
const carData = {
  brand_name: "Hyundai",
  model_name: "Tucson",
  // ... other car data
};
await manageTrendingCars("add", carData);

// Delete a car
await manageTrendingCars("delete", { car_id: "car_001" });

// Fetch all cars
const cars = await manageTrendingCars("fetch");
```

## 🚀 Features

- ✅ **Multi-Operation Support**: Add, delete, and fetch cars in one endpoint
- ✅ **Comprehensive Car Data**: Detailed specifications, dimensions, and features
- ✅ **Unique ID Generation**: Automatic car_id generation (car_XXXXX format)
- ✅ **Data Validation**: Comprehensive validation for all fields
- ✅ **Error Handling**: Detailed error responses with error types
- ✅ **No Authentication**: Public API for easy integration
- ✅ **Database Optimization**: Indexed fields for better performance

## 🔒 Security Considerations

- **Input Validation**: All inputs are validated and sanitized
- **Data Type Validation**: Strict type checking for all fields
- **SQL Injection Prevention**: Uses parameterized queries
- **Error Information**: Limited error details to prevent information leakage
- **Rate Limiting**: Can be implemented at the server level

## 📊 Performance

- **Efficient Queries**: Indexed car_id for fast lookups
- **Optimized Schema**: Well-structured data for quick retrieval
- **Minimal Data Transfer**: Only returns necessary data
- **Database Indexing**: Proper indexes on frequently queried fields

## 🎯 Error Scenarios

### 1. Missing hit_type
- **Trigger**: When hit_type is not provided
- **Response**: 400 Bad Request with "Invalid parameter" error type

### 2. Invalid hit_type
- **Trigger**: When hit_type is not "add", "delete", or "fetch"
- **Response**: 400 Bad Request with "Invalid parameter" error type

### 3. Missing Required Fields (Add Operation)
- **Trigger**: When required fields are missing for add operation
- **Response**: 400 Bad Request with "Invalid parameter" error type

### 4. Invalid Data Types
- **Trigger**: When price is not a number or music_system_count is invalid
- **Response**: 400 Bad Request with "Invalid parameter" error type

### 5. Car Not Found (Delete Operation)
- **Trigger**: When car_id doesn't exist in database
- **Response**: 404 Not Found with "invalid_id" error type

### 6. Server Errors
- **Trigger**: Database connection issues or server errors
- **Response**: 500 Internal Server Error with "other" error type

## 🧪 Testing

### Test Cases
1. **Add Valid Car**: Should return success with car added
2. **Add Car with Missing Fields**: Should return 400 with "Invalid parameter"
3. **Add Car with Invalid Price**: Should return 400 with "Invalid parameter"
4. **Delete Existing Car**: Should return success with car deleted
5. **Delete Non-existent Car**: Should return 404 with "invalid_id"
6. **Delete with Missing car_id**: Should return 400 with "Invalid parameter"
7. **Fetch All Cars**: Should return success with car list
8. **Invalid hit_type**: Should return 400 with "Invalid parameter"

### Sample Test Data
```json
{
  "valid_car_data": {
    "brand_name": "Hyundai",
    "model_name": "Tucson",
    "type": "Premium Midsize SUV",
    "price": 2927000,
    "price_display": "₹29.27 Lakh onwards",
    "mileage": "35 kmpl",
    "top_speed": "212 km/h",
    "image_url": "https://example.com/images/tucson_blue.png",
    "specifications": {
      "engine_capacity": "1997 cc",
      "transmission": "Automatic (AMT)",
      "fuel_tank_capacity": "37 Liters",
      "seat_height": "450 mm",
      "kerb_weight": "1750 kg"
    },
    "detailed_specifications": {
      "max_power": "89 bhp",
      "max_torque": "120 Nm",
      "riding_mode": "Eco, Normal, Sport",
      "gear_shifting_pattern": "6-speed automatic"
    },
    "dimensions": {
      "bootspace": "420 Liters",
      "ground_clearance": "163 mm",
      "length": "3999 mm",
      "width": "1735 mm",
      "height": "1525 mm"
    },
    "features": {
      "air_conditioner": true,
      "central_locking": "Keyless",
      "power_windows": "Front & Rear",
      "headrest": "Front & Rear",
      "parking_assist": "Reverse Camera with Guidance",
      "cruise_control": true,
      "music_system_count": 1,
      "apple_carplay": "Wireless",
      "android_auto": "Wireless",
      "abs": true,
      "sunroof": false,
      "third_row_ac": false,
      "airbags": ["Driver", "Front Passenger", "Curtain", "Side", "Rear Passenger"]
    }
  },
  "valid_car_id": "car_12345",
  "invalid_car_id": "car_99999"
}
```

## 🔄 Database Operations

### Add Car
1. **Generate ID**: Create unique car_id (car_XXXXX)
2. **Validate Data**: Check all required fields and data types
3. **Create Document**: Insert new car document
4. **Return Success**: Confirm car addition

### Delete Car
1. **Find Car**: Query by car_id
2. **Verify Existence**: Check if car exists
3. **Delete Document**: Remove car from collection
4. **Return Success**: Confirm car deletion

### Fetch Cars
1. **Query All**: Retrieve all car documents
2. **Sort Results**: Order by creation date (newest first)
3. **Return Data**: Send complete car list with count

## 🎯 Future Enhancements

1. **Update Car**: Add functionality to update existing car data
2. **Search Cars**: Add search functionality by brand, model, or type
3. **Filter Cars**: Add filtering by price range, features, etc.
4. **Pagination**: Implement pagination for large car lists
5. **Image Upload**: Allow direct image upload instead of URL
6. **Car Categories**: Add car category management
7. **Popularity Tracking**: Track car views and popularity
8. **Car Comparisons**: Add car comparison functionality

## 📞 Support

For issues with the Trending Cars API:
1. Verify hit_type is one of: "add", "delete", "fetch"
2. Check all required fields are provided for add operation
3. Ensure car_id exists for delete operation
4. Review data types and formats
5. Check server logs for detailed error information

## 🎉 Success!

This API provides comprehensive trending cars management with support for adding, deleting, and fetching cars. The flexible hit_type parameter allows multiple operations through a single endpoint, making it efficient and easy to use.

