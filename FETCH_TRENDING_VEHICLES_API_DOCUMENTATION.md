# 🚗 Fetch Trending Vehicles API Documentation

## 🌟 Overview
This endpoint allows users to fetch the list of all the Top Trending cars from the database collection. The API returns a maximum of 4 cars, sorted by creation date (newest first).

## 🔗 Endpoint
```
POST https://digivahan.in/api/add-vehicle-to-top_trending
```

## 🔐 Authentication
**No Authentication Required** - This is a public API endpoint.

## 🌐 HTTP Method
**POST**

## 📌 Request Parameters
No request parameters are required for this endpoint. The API will automatically return the top 4 trending cars.

## 📤 Request Example
```json
{}
```

## 📥 Response Examples

### ✅ Success Response
```json
{
  "status": true,
  "message": "Trending cars fetched successfully",
  "cars": [
    {
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
    {
      "car_id": "car_002",
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
  ]
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

## 🧠 Backend Logic

### Process Flow
1. **Database Query**: Query the TrendingCars collection
2. **Sorting**: Sort cars by creation date (newest first)
3. **Limit Results**: Limit results to maximum 4 cars
4. **Response**: Return the top trending cars

### Database Operations
- **Query**: `TrendingCars.find({}).sort({ created_at: -1 }).limit(4)`
- **Sorting**: By `created_at` field in descending order (newest first)
- **Limit**: Maximum 4 cars returned regardless of total count

## 🔧 Technical Implementation

### Response Structure
- **status**: Boolean indicating success/failure
- **message**: Success or error message
- **cars**: Array of car objects (maximum 4)

### Car Object Structure
Each car object contains:
- **Basic Info**: car_id, brand_name, model_name, type, price, price_display
- **Performance**: mileage, top_speed, image_url
- **Specifications**: engine_capacity, transmission, fuel_tank_capacity, etc.
- **Detailed Specs**: max_power, max_torque, riding_mode, gear_shifting_pattern
- **Dimensions**: bootspace, ground_clearance, length, width, height
- **Features**: air_conditioner, central_locking, power_windows, etc.

### Error Handling
- **Server Errors**: Database connection issues or server errors
- **Validation Errors**: Input validation failures (though no input required)

## 📝 Usage Examples

### cURL Example
```bash
curl -X POST https://digivahan.in/api/add-vehicle-to-top_trending \
  -H "Content-Type: application/json" \
  -d '{}'
```

### JavaScript Example
```javascript
const fetchTopTrendingVehicles = async () => {
  try {
    const response = await fetch('https://digivahan.in/api/add-vehicle-to-top_trending', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });

    const result = await response.json();
    
    if (result.status) {
      console.log('Top trending vehicles:', result.cars);
      return result.cars;
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
const trendingCars = await fetchTopTrendingVehicles();
if (trendingCars) {
  console.log(`Found ${trendingCars.length} trending cars`);
  trendingCars.forEach(car => {
    console.log(`${car.brand_name} ${car.model_name} - ${car.price_display}`);
  });
}
```

### Python Example
```python
import requests
import json

def fetch_top_trending_vehicles():
    url = "https://digivahan.in/api/add-vehicle-to-top_trending"
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, headers=headers, data=json.dumps({}))
        result = response.json()
        
        if result["status"]:
            print(f"Found {len(result['cars'])} trending cars")
            for car in result["cars"]:
                print(f"{car['brand_name']} {car['model_name']} - {car['price_display']}")
            return result["cars"]
        else:
            print(f"Error: {result['message']}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"Network error: {e}")
        return None

# Usage
trending_cars = fetch_top_trending_vehicles()
```

## 🚀 Features

- ✅ **No Input Required**: Simple endpoint with no parameters needed
- ✅ **Limited Results**: Returns maximum 4 cars regardless of database size
- ✅ **Sorted Results**: Cars sorted by creation date (newest first)
- ✅ **Complete Car Data**: Full car specifications and features
- ✅ **Error Handling**: Comprehensive error responses
- ✅ **No Authentication**: Public API for easy integration
- ✅ **Fast Response**: Optimized database queries with limits

## 🔒 Security Considerations

- **No Input Validation**: No user input to validate
- **Database Security**: Uses parameterized queries
- **Error Information**: Limited error details to prevent information leakage
- **Rate Limiting**: Can be implemented at the server level

## 📊 Performance

- **Efficient Queries**: Limited to 4 results for fast response
- **Database Indexing**: Uses indexed created_at field for sorting
- **Minimal Data Transfer**: Only returns necessary car data
- **Optimized Schema**: Well-structured data for quick retrieval

## 🎯 Use Cases

### 1. Homepage Display
- Show top 4 trending cars on homepage
- Quick loading with limited data

### 2. Mobile App
- Display trending cars in app dashboard
- Efficient for mobile data usage

### 3. Car Showcase
- Feature top trending cars
- Highlight most popular vehicles

### 4. Marketing
- Promote trending vehicles
- Showcase popular car models

## 🔄 Database Schema

### TrendingCars Collection
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
  specifications: Object,   // Basic specifications
  detailed_specifications: Object, // Detailed specifications
  dimensions: Object,       // Car dimensions
  features: Object,         // Car features
  created_at: Date,         // Creation timestamp
  updated_at: Date          // Last update timestamp
}
```

### Query Performance
- **Index**: `created_at` field is indexed for fast sorting
- **Limit**: Results limited to 4 for optimal performance
- **Sort**: Descending order by creation date

## 🧪 Testing

### Test Cases
1. **Fetch Trending Cars**: Should return maximum 4 cars
2. **Empty Database**: Should return empty cars array
3. **Less Than 4 Cars**: Should return all available cars
4. **More Than 4 Cars**: Should return exactly 4 cars (newest first)
5. **Server Error**: Should return appropriate error response

### Sample Test Scenarios
```javascript
// Test with empty database
const emptyResult = await fetchTopTrendingVehicles();
// Expected: { status: true, message: "Trending cars fetched successfully", cars: [] }

// Test with 2 cars in database
const twoCarsResult = await fetchTopTrendingVehicles();
// Expected: { status: true, message: "Trending cars fetched successfully", cars: [car1, car2] }

// Test with 10 cars in database
const tenCarsResult = await fetchTopTrendingVehicles();
// Expected: { status: true, message: "Trending cars fetched successfully", cars: [car1, car2, car3, car4] }
```

## 🔧 Integration Notes

### Frontend Integration
- Handle empty cars array gracefully
- Display loading state during API call
- Show appropriate message when no cars available
- Implement error handling for failed requests

### Backend Integration
- Ensure TrendingCars collection exists
- Verify database connection
- Monitor query performance
- Implement caching if needed

## 📞 Support

For issues with the Fetch Trending Vehicles API:
1. Check database connection
2. Verify TrendingCars collection exists
3. Ensure cars are added to the collection
4. Review server logs for detailed error information
5. Check database indexes for performance

## 🎉 Success!

This API provides a simple and efficient way to fetch the top trending vehicles with a maximum of 4 cars. The endpoint is optimized for performance and provides complete car data for display purposes.

