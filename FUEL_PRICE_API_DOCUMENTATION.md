# ⛽ Fuel Price API Documentation

## Overview
The Fuel Price API allows users to check and update fuel prices by state. The API supports both retrieval and update operations based on the provided parameters.

## 🔗 Base URL
```
https://digivahan.in/api/v1/fuel-price
```

## 🔐 Authentication
**No Authentication Required** - This is a public API endpoint.

## 📋 Available Endpoints

### 1. Main Fuel Price Endpoint
**POST** `/api/v1/fuel-price`

This endpoint handles both GET and UPDATE operations based on the request parameters.

#### Request Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `state` | string | Yes | State name in uppercase format (e.g., "UTTAR_PRADESH") |
| `petrol_price` | number | No | Petrol price per liter |
| `diesel_price` | number | No | Diesel price per liter |
| `cng_price` | number | No | CNG price per kg |

#### Request Examples

**Get all fuel prices:**
```json
{
    "state": ""
}
```

**Get fuel price for specific state:**
```json
{
    "state": "UTTAR_PRADESH"
}
```

**Update fuel price for specific state:**
```json
{
    "state": "UTTAR_PRADESH",
    "petrol_price": 97.45,
    "diesel_price": 89.75,
    "cng_price": 74.00
}
```

#### Response Examples

**✅ Success - Get all fuel prices:**
```json
{
    "status": true,
    "message": "Here is the complete node of fuels list",
    "fuel": [
        {
            "state": "UTTAR PRADESH",
            "petrol_price": 97.45,
            "diesel_price": 89.75,
            "cng_price": 74.00,
            "last_updated": "2025-01-08T12:34:56Z"
        },
        {
            "state": "DELHI",
            "petrol_price": 97.45,
            "diesel_price": 89.75,
            "cng_price": 74.00,
            "last_updated": "2025-01-08T12:34:56Z"
        },
        {
            "state": "UTTARAKHAND",
            "petrol_price": 97.45,
            "diesel_price": 89.75,
            "cng_price": 74.00,
            "last_updated": "2025-01-08T12:34:56Z"
        }
    ]
}
```

**✅ Success - Get specific state fuel price:**
```json
{
    "status": true,
    "message": "Fuel price retrieved successfully",
    "fuel": [
        {
            "state": "UTTAR PRADESH",
            "petrol_price": 97.45,
            "diesel_price": 89.75,
            "cng_price": 74.00,
            "last_updated": "2025-01-08T12:34:56Z"
        }
    ]
}
```

**✅ Success - Update fuel price:**
```json
{
    "status": true,
    "message": "Fuel price has been updated for the selected state"
}
```

**❌ Error - Invalid parameters:**
```json
{
    "status": false,
    "error_type": "Invalid parameter",
    "message": "You have entered invalid parameter"
}
```

**❌ Error - State not found:**
```json
{
    "status": false,
    "error_type": "Invalid parameter",
    "message": "State not found"
}
```

**❌ Error - Server issue:**
```json
{
    "status": false,
    "error_type": "other",
    "message": "Server not working."
}
```

### 2. Get All Fuel Prices
**GET** `/api/v1/fuel-price/all`

Retrieves all fuel prices across all states.

#### Response
```json
{
    "status": true,
    "message": "Here is the complete node of fuels list",
    "fuel": [
        {
            "state": "UTTAR PRADESH",
            "petrol_price": 97.45,
            "diesel_price": 89.75,
            "cng_price": 74.00,
            "last_updated": "2025-01-08T12:34:56Z"
        }
    ]
}
```

### 3. Get Fuel Price by State
**GET** `/api/v1/fuel-price/:state`

Retrieves fuel price for a specific state.

#### URL Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `state` | string | Yes | State name in uppercase format |

#### Response
```json
{
    "status": true,
    "message": "Fuel price retrieved successfully",
    "fuel": [
        {
            "state": "UTTAR PRADESH",
            "petrol_price": 97.45,
            "diesel_price": 89.75,
            "cng_price": 74.00,
            "last_updated": "2025-01-08T12:34:56Z"
        }
    ]
}
```

## 🧠 Backend Logic

### Operation Detection
The API determines the operation based on the provided parameters:

1. **GET Operation**: If only `state` is provided (or empty state for all states)
2. **UPDATE Operation**: If `state` and all fuel prices (`petrol_price`, `diesel_price`, `cng_price`) are provided

### Database Operations
- **GET**: Searches the `fuelprices` collection for the specified state or all states
- **UPDATE**: Uses `findOneAndUpdate` with `upsert: true` to create or update the fuel price record

### Validation Rules
- **State**: Required, 2-50 characters, uppercase letters and underscores only
- **Fuel Prices**: Optional for GET, required for UPDATE, must be valid numbers between 0-1000
- **All fuel prices must be provided together** for update operations

## 🔧 Technical Implementation

### Database Schema
```javascript
{
  state: String (required, unique, uppercase),
  petrol_price: Number (required, min: 0),
  diesel_price: Number (required, min: 0),
  cng_price: Number (required, min: 0),
  last_updated: Date (auto-updated),
  created_at: Date (auto-created),
  updated_at: Date (auto-updated)
}
```

### Validation Middleware
- Comprehensive input validation using `express-validator`
- Custom validators for fuel price ranges and formats
- State format validation (uppercase with underscores)

### Error Handling
- Detailed error messages for different failure scenarios
- Proper HTTP status codes (400, 404, 500)
- Consistent error response format

## 📝 Usage Examples

### cURL Examples

**Get all fuel prices:**
```bash
curl -X POST https://digivahan.in/api/v1/fuel-price \
  -H "Content-Type: application/json" \
  -d '{"state": ""}'
```

**Get specific state fuel price:**
```bash
curl -X POST https://digivahan.in/api/v1/fuel-price \
  -H "Content-Type: application/json" \
  -d '{"state": "UTTAR_PRADESH"}'
```

**Update fuel price:**
```bash
curl -X POST https://digivahan.in/api/v1/fuel-price \
  -H "Content-Type: application/json" \
  -d '{
    "state": "UTTAR_PRADESH",
    "petrol_price": 97.45,
    "diesel_price": 89.75,
    "cng_price": 74.00
  }'
```

**Get all fuel prices (GET endpoint):**
```bash
curl -X GET https://digivahan.in/api/v1/fuel-price/all
```

**Get fuel price by state (GET endpoint):**
```bash
curl -X GET https://digivahan.in/api/v1/fuel-price/UTTAR_PRADESH
```

## 🚀 Features

- ✅ **Dual Operation Support**: Single endpoint for both GET and UPDATE operations
- ✅ **State-based Pricing**: Manage fuel prices by Indian states
- ✅ **Comprehensive Validation**: Input validation with detailed error messages
- ✅ **Flexible Retrieval**: Get all states or specific state data
- ✅ **Automatic Timestamps**: Track when prices were last updated
- ✅ **Database Optimization**: Indexed state field for fast queries
- ✅ **Error Handling**: Proper error responses with appropriate HTTP status codes
- ✅ **No Authentication**: Public API for easy integration

## 🔒 Security Considerations

- Input validation prevents injection attacks
- State names are normalized to uppercase
- Fuel prices are validated for reasonable ranges (0-1000)
- No sensitive data exposure in responses
- Proper error handling without information leakage

## 📊 Performance

- Database indexes on state field for fast lookups
- Efficient MongoDB queries with projection
- Minimal data transfer with optimized response format
- Serverless-ready architecture for scalability
