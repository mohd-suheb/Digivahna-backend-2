# 🚘 Compare Vehicles API Documentation

## 🌟 Overview
This endpoint allows users to create a new comparison between 2 vehicles by providing their car IDs. The API assigns a unique comparison ID and stores the complete vehicle data for both cars. It also supports fetching all comparisons when no parameters are provided.

## 🔗 Endpoint
```
POST https://digivahan.in/api/vehicles/compare
```

## 🔐 Authentication
**No Authentication Required** - This is a public API endpoint.

## 🌐 HTTP Method
**POST**

## 📌 Request Parameters
The request behavior depends on whether parameters are provided:

### Case 1: Create Comparison (with parameters)
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `car_1` | string | Yes | First car ID for comparison |
| `car_2` | string | Yes | Second car ID for comparison |

### Case 2: Get All Comparisons (no parameters)
No parameters required - returns all existing comparisons.

## 📤 Request Examples

### Create Comparison
```json
{
  "car_1": "car_001",
  "car_2": "car_002"
}
```

### Get All Comparisons
```json
{}
```

## 📥 Response Examples

### ✅ Success Responses

#### Create Comparison Success
```json
{
  "status": true,
  "message": "Comparison data added successfully"
}
```

#### Get All Comparisons Success
```json
{
  "status": true,
  "message": "Comparisons fetched successfully",
  "data": {
    "comparisons": [
      {
        "comparison_id": "comp_12345",
        "car_1_id": "car_001",
        "car_2_id": "car_002",
        "car_1_data": {
          "car_id": "car_001",
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
        },
        "car_2_data": {
          // Complete car data for second vehicle
        },
        "comparison_metadata": {
          "created_at": "2025-01-27T10:30:00.000Z",
          "updated_at": "2025-01-27T10:30:00.000Z",
          "comparison_count": 1
        }
      }
    ],
    "total_count": 1
  }
}
```

### ❌ Error Responses

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

#### Car Not Found
```json
{
  "status": false,
  "error_type": "invalid_id",
  "message": "car_1 does not exist"
}
```

#### Same Car Comparison
```json
{
  "status": false,
  "error_type": "Invalid parameter",
  "message": "Cannot compare a car with itself"
}
```

## 🧠 Backend Logic

### Create Comparison Process
1. **Parameter Validation**: Check if car_1 and car_2 are provided and valid
2. **Car Existence Check**: Verify both cars exist in TrendingCars collection
3. **Duplicate Check**: Check if comparison already exists (either direction)
4. **Data Fetching**: Retrieve complete car data for both vehicles
5. **Comparison Creation/Update**: Create new comparison or update existing one
6. **Response**: Return success confirmation

### Get All Comparisons Process
1. **No Parameters Check**: Detect when no parameters are provided
2. **Database Query**: Retrieve all comparisons from VehicleComparison collection
3. **Sorting**: Sort by update date (newest first)
4. **Response**: Return complete comparison list

### Comparison Logic
- **Unique Comparison ID**: Auto-generated in format `comp_XXXXX`
- **Bidirectional Matching**: Handles comparisons in both directions (A vs B = B vs A)
- **Update Existing**: If comparison exists, updates data and increments count
- **Complete Data Storage**: Stores full car data for both vehicles

## 🔧 Technical Implementation

### Database Schema
```javascript
{
  comparison_id: String,        // Unique identifier (comp_XXXXX)
  car_1_id: String,            // First car ID
  car_2_id: String,            // Second car ID
  car_1_data: Object,          // Complete first car data
  car_2_data: Object,          // Complete second car data
  comparison_metadata: {
    created_at: Date,          // Creation timestamp
    updated_at: Date,          // Last update timestamp
    comparison_count: Number   // Number of times compared
  }
}
```

### Validation Rules
- **car_1**: Required for comparison, must be valid car ID
- **car_2**: Required for comparison, must be valid car ID
- **Different Cars**: car_1 and car_2 must be different
- **Car Existence**: Both cars must exist in TrendingCars collection

### Error Types
- **"invalid_id"**: Car ID does not exist
- **"other"**: Server errors and general issues
- **"Invalid parameter"**: Input validation errors

## 📝 Usage Examples

### cURL Examples

#### Create Comparison
```bash
curl -X POST https://digivahan.in/api/vehicles/compare \
  -H "Content-Type: application/json" \
  -d '{
    "car_1": "car_001",
    "car_2": "car_002"
  }'
```

#### Get All Comparisons
```bash
curl -X POST https://digivahan.in/api/vehicles/compare \
  -H "Content-Type: application/json" \
  -d '{}'
```

### JavaScript Example
```javascript
const compareVehicles = async (car1Id, car2Id) => {
  try {
    const response = await fetch('https://digivahan.in/api/vehicles/compare', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        car_1: car1Id,
        car_2: car2Id
      })
    });

    const result = await response.json();
    
    if (result.status) {
      console.log('Comparison created successfully');
      return result;
    } else {
      console.error('Error:', result.message);
      return null;
    }
  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
};

const getAllComparisons = async () => {
  try {
    const response = await fetch('https://digivahan.in/api/vehicles/compare', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });

    const result = await response.json();
    
    if (result.status) {
      console.log(`Found ${result.data.total_count} comparisons`);
      return result.data.comparisons;
    } else {
      console.error('Error:', result.message);
      return null;
    }
  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
};

// Usage
// Create comparison
await compareVehicles("car_001", "car_002");

// Get all comparisons
const comparisons = await getAllComparisons();
```

### Python Example
```python
import requests
import json

def compare_vehicles(car1_id, car2_id):
    url = "https://digivahan.in/api/vehicles/compare"
    
    payload = {
        "car_1": car1_id,
        "car_2": car2_id
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, headers=headers, data=json.dumps(payload))
        result = response.json()
        
        if result["status"]:
            print("Comparison created successfully")
            return result
        else:
            print(f"Error: {result['message']}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"Network error: {e}")
        return None

def get_all_comparisons():
    url = "https://digivahan.in/api/vehicles/compare"
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, headers=headers, data=json.dumps({}))
        result = response.json()
        
        if result["status"]:
            print(f"Found {result['data']['total_count']} comparisons")
            return result["data"]["comparisons"]
        else:
            print(f"Error: {result['message']}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"Network error: {e}")
        return None

# Usage
# Create comparison
compare_vehicles("car_001", "car_002")

# Get all comparisons
comparisons = get_all_comparisons()
```

## 🚀 Features

- ✅ **Dual Functionality**: Create comparison or get all comparisons
- ✅ **Unique Comparison ID**: Auto-generated comparison identifiers
- ✅ **Bidirectional Matching**: Handles comparisons in both directions
- ✅ **Complete Data Storage**: Stores full vehicle data for both cars
- ✅ **Update Existing**: Updates existing comparisons instead of duplicating
- ✅ **Comparison Tracking**: Tracks comparison count and timestamps
- ✅ **Error Handling**: Comprehensive error responses
- ✅ **No Authentication**: Public API for easy integration

## 🔒 Security Considerations

- **Input Validation**: All inputs are validated and sanitized
- **Car Existence Check**: Verifies cars exist before creating comparison
- **Duplicate Prevention**: Prevents comparing car with itself
- **Data Integrity**: Ensures complete car data is stored
- **Error Information**: Limited error details to prevent information leakage

## 📊 Performance

- **Efficient Queries**: Indexed fields for fast lookups
- **Bidirectional Search**: Handles comparisons in both directions efficiently
- **Data Caching**: Stores complete car data to avoid repeated queries
- **Optimized Schema**: Well-structured data for quick retrieval

## 🎯 Use Cases

### 1. Vehicle Comparison Tool
- Allow users to compare two vehicles side by side
- Store comparison data for future reference

### 2. Comparison History
- Track all vehicle comparisons made
- Show comparison frequency and popularity

### 3. Recommendation Engine
- Use comparison data for vehicle recommendations
- Analyze comparison patterns

### 4. Analytics Dashboard
- Display comparison statistics
- Track most compared vehicles

## 🔄 Database Operations

### Create/Update Comparison
1. **Check Existence**: Look for existing comparison (bidirectional)
2. **Fetch Car Data**: Get complete data for both cars
3. **Create/Update**: Create new or update existing comparison
4. **Increment Count**: Track comparison frequency

### Get All Comparisons
1. **Query All**: Retrieve all comparison documents
2. **Sort Results**: Order by update date (newest first)
3. **Return Data**: Send complete comparison list

## 🧪 Testing

### Test Cases
1. **Create Valid Comparison**: Should return success
2. **Create Comparison with Same Cars**: Should return error
3. **Create Comparison with Non-existent Car**: Should return error
4. **Create Comparison with Missing Parameters**: Should return error
5. **Get All Comparisons**: Should return all comparisons
6. **Update Existing Comparison**: Should update and increment count

### Sample Test Data
```json
{
  "valid_car_1": "car_001",
  "valid_car_2": "car_002",
  "invalid_car_1": "car_99999",
  "invalid_car_2": "car_88888"
}
```

## 🔧 Integration Notes

### Frontend Integration
- Handle both create and fetch operations
- Display comparison data in user-friendly format
- Implement error handling for all scenarios
- Show loading states during API calls

### Backend Integration
- Ensure TrendingCars collection has data
- Monitor comparison creation frequency
- Implement rate limiting if needed
- Track comparison analytics

## 📞 Support

For issues with the Compare Vehicles API:
1. Verify both car IDs exist in TrendingCars collection
2. Check car IDs are different
3. Ensure proper JSON format in request
4. Review server logs for detailed error information
5. Verify database connection and indexes

## 🎉 Success!

This API provides comprehensive vehicle comparison functionality with support for creating comparisons and retrieving all comparison data. The bidirectional matching and complete data storage make it perfect for building vehicle comparison tools and analytics dashboards.

