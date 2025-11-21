# 🚘 Vehicle Tips & Tricks API Documentation

## 🌟 Overview
This endpoint allows users to manipulate tips and tricks for vehicles. Users can add new tips or update existing ones by providing a tip_id. The API automatically generates unique tip IDs for new tips and updates existing ones when a tip_id is provided.

## 🔗 Endpoint
```
POST https://digivahan.in/api/v1/tips-tricks
```

## 🔐 Authentication
**No Authentication Required** - This is a public API endpoint.

## 🌐 HTTP Method
**POST**

## 📌 Request Parameters
The request behavior depends on whether `tip_id` is provided:

### Case 1: Add New Tip (without tip_id)
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `banner_url` | string | Yes | URL of the banner image |
| `title` | string | Yes | Title of the tip |
| `summary` | string | Yes | Summary description of the tip |
| `points` | array | Yes | Array of tip points with icon and message |

### Case 2: Update Existing Tip (with tip_id)
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tip_id` | string | Yes | Unique identifier of the tip to update |
| `banner_url` | string | Yes | URL of the banner image |
| `title` | string | Yes | Title of the tip |
| `summary` | string | Yes | Summary description of the tip |
| `points` | array | Yes | Array of tip points with icon and message |

### Points Array Structure
Each point in the `points` array should contain:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `icon` | string | Yes | URL of the icon image |
| `message` | string | Yes | The tip message text |

## 📤 Request Examples

### Case 1: Add New Tip
```json
{
  "banner_url": "https://yourcdn.com/images/tyre-check.jpg",
  "title": "Tyre Maintenance Tips",
  "summary": "Tyres play a major role in road safety. Here are some quick maintenance tips.",
  "points": [
    {
      "icon": "https://yourcdn.com/icons/tyre-pressure.png",
      "message": "Check tyre pressure weekly."
    },
    {
      "icon": "https://yourcdn.com/icons/tyre-rotation.png",
      "message": "Rotate tyres every 10,000 km."
    },
    {
      "icon": "https://yourcdn.com/icons/overload.png",
      "message": "Avoid overloading your car."
    },
    {
      "icon": "https://yourcdn.com/icons/tyre-wear.png",
      "message": "Check for uneven wear patterns."
    }
  ]
}
```

### Case 2: Update Existing Tip
```json
{
  "tip_id": "tt_102",
  "banner_url": "https://yourcdn.com/images/tyre-check.jpg",
  "title": "Tyre Maintenance Tips",
  "summary": "Tyres play a major role in road safety. Here are some quick maintenance tips.",
  "points": [
    {
      "icon": "https://yourcdn.com/icons/tyre-pressure.png",
      "message": "Check tyre pressure weekly."
    },
    {
      "icon": "https://yourcdn.com/icons/tyre-rotation.png",
      "message": "Rotate tyres every 10,000 km."
    },
    {
      "icon": "https://yourcdn.com/icons/overload.png",
      "message": "Avoid overloading your car."
    },
    {
      "icon": "https://yourcdn.com/icons/tyre-wear.png",
      "message": "Check for uneven wear patterns."
    }
  ]
}
```

## 📥 Response Examples

### ✅ Success Responses

#### Add New Tip Success
```json
{
  "status": true,
  "message": "Tips and Tricks added successfully.",
  "data": {
    "tip_id": "tt_102",
    "title": "Tyre Maintenance Tips"
  }
}
```

#### Update Existing Tip Success
```json
{
  "status": true,
  "message": "Tips and Tricks updated successfully."
}
```

### ❌ Error Responses

#### Server Issue
```json
{
  "status": false,
  "error_type": "other",
  "message": "Server not working."
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

#### Tip Not Found (for updates)
```json
{
  "status": false,
  "error_type": "invalid_id",
  "message": "tip id does not exist"
}
```

## 🧠 Backend Logic

### Add New Tip Process
1. **Parameter Validation**: Check if all required fields are provided
2. **Points Validation**: Validate points array and each point structure
3. **Tip ID Generation**: Generate unique tip_id in format `tt_XXXXX`
4. **Database Save**: Save new tip to TipsTricks collection
5. **Response**: Return success with generated tip_id and title

### Update Existing Tip Process
1. **Parameter Validation**: Check if tip_id and all required fields are provided
2. **Tip Existence Check**: Verify tip exists in database
3. **Points Validation**: Validate points array and each point structure
4. **Database Update**: Update existing tip in TipsTricks collection
5. **Response**: Return success confirmation

### Tip ID Generation
- **Format**: `tt_XXXXX` (e.g., tt_12345)
- **Uniqueness**: Ensures no duplicate tip_ids
- **Auto-generation**: Only for new tips, not updates

## 🔧 Technical Implementation

### Database Schema
```javascript
{
  tip_id: String,           // Unique identifier (tt_XXXXX)
  banner_url: String,       // Banner image URL
  title: String,            // Tip title
  summary: String,          // Tip summary
  points: [                 // Array of tip points
    {
      icon: String,         // Icon image URL
      message: String       // Tip message
    }
  ],
  created_at: Date,         // Creation timestamp
  updated_at: Date          // Last update timestamp
}
```

### Validation Rules
- **banner_url**: Required, must be a non-empty string
- **title**: Required, must be a non-empty string
- **summary**: Required, must be a non-empty string
- **points**: Required, must be a non-empty array
- **points[].icon**: Required, must be a non-empty string
- **points[].message**: Required, must be a non-empty string
- **tip_id**: Optional for new tips, required for updates

### Error Types
- **"invalid_id"**: Tip ID does not exist
- **"other"**: Server errors and general issues
- **"Invalid parameter"**: Input validation errors

## 📝 Usage Examples

### cURL Examples

#### Add New Tip
```bash
curl -X POST https://digivahan.in/api/v1/tips-tricks \
  -H "Content-Type: application/json" \
  -d '{
    "banner_url": "https://yourcdn.com/images/tyre-check.jpg",
    "title": "Tyre Maintenance Tips",
    "summary": "Tyres play a major role in road safety. Here are some quick maintenance tips.",
    "points": [
      {
        "icon": "https://yourcdn.com/icons/tyre-pressure.png",
        "message": "Check tyre pressure weekly."
      },
      {
        "icon": "https://yourcdn.com/icons/tyre-rotation.png",
        "message": "Rotate tyres every 10,000 km."
      },
      {
        "icon": "https://yourcdn.com/icons/overload.png",
        "message": "Avoid overloading your car."
      },
      {
        "icon": "https://yourcdn.com/icons/tyre-wear.png",
        "message": "Check for uneven wear patterns."
      }
    ]
  }'
```

#### Update Existing Tip
```bash
curl -X POST https://digivahan.in/api/v1/tips-tricks \
  -H "Content-Type: application/json" \
  -d '{
    "tip_id": "tt_102",
    "banner_url": "https://yourcdn.com/images/tyre-check.jpg",
    "title": "Tyre Maintenance Tips",
    "summary": "Tyres play a major role in road safety. Here are some quick maintenance tips.",
    "points": [
      {
        "icon": "https://yourcdn.com/icons/tyre-pressure.png",
        "message": "Check tyre pressure weekly."
      },
      {
        "icon": "https://yourcdn.com/icons/tyre-rotation.png",
        "message": "Rotate tyres every 10,000 km."
      },
      {
        "icon": "https://yourcdn.com/icons/overload.png",
        "message": "Avoid overloading your car."
      },
      {
        "icon": "https://yourcdn.com/icons/tyre-wear.png",
        "message": "Check for uneven wear patterns."
      }
    ]
  }'
```

### JavaScript Example
```javascript
const manageTipsTricks = async (tipData, tipId = null) => {
  try {
    const payload = { ...tipData };
    if (tipId) {
      payload.tip_id = tipId;
    }

    const response = await fetch('https://digivahan.in/api/v1/tips-tricks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (result.status) {
      console.log('Success:', result.message);
      if (result.data) {
        console.log('Tip ID:', result.data.tip_id);
        console.log('Title:', result.data.title);
      }
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

// Usage examples
const tipData = {
  banner_url: "https://yourcdn.com/images/tyre-check.jpg",
  title: "Tyre Maintenance Tips",
  summary: "Tyres play a major role in road safety. Here are some quick maintenance tips.",
  points: [
    {
      icon: "https://yourcdn.com/icons/tyre-pressure.png",
      message: "Check tyre pressure weekly."
    },
    {
      icon: "https://yourcdn.com/icons/tyre-rotation.png",
      message: "Rotate tyres every 10,000 km."
    },
    {
      icon: "https://yourcdn.com/icons/overload.png",
      message: "Avoid overloading your car."
    },
    {
      icon: "https://yourcdn.com/icons/tyre-wear.png",
      message: "Check for uneven wear patterns."
    }
  ]
};

// Add new tip
await manageTipsTricks(tipData);

// Update existing tip
await manageTipsTricks(tipData, "tt_102");
```

### Python Example
```python
import requests
import json

def manage_tips_tricks(tip_data, tip_id=None):
    url = "https://digivahan.in/api/v1/tips-tricks"
    
    payload = tip_data.copy()
    if tip_id:
        payload["tip_id"] = tip_id
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, headers=headers, data=json.dumps(payload))
        result = response.json()
        
        if result["status"]:
            print("Success:", result["message"])
            if "data" in result:
                print("Tip ID:", result["data"]["tip_id"])
                print("Title:", result["data"]["title"])
            return result
        else:
            print("Error:", result["message"])
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"Network error: {e}")
        return None

# Usage examples
tip_data = {
    "banner_url": "https://yourcdn.com/images/tyre-check.jpg",
    "title": "Tyre Maintenance Tips",
    "summary": "Tyres play a major role in road safety. Here are some quick maintenance tips.",
    "points": [
        {
            "icon": "https://yourcdn.com/icons/tyre-pressure.png",
            "message": "Check tyre pressure weekly."
        },
        {
            "icon": "https://yourcdn.com/icons/tyre-rotation.png",
            "message": "Rotate tyres every 10,000 km."
        },
        {
            "icon": "https://yourcdn.com/icons/overload.png",
            "message": "Avoid overloading your car."
        },
        {
            "icon": "https://yourcdn.com/icons/tyre-wear.png",
            "message": "Check for uneven wear patterns."
        }
    ]
}

# Add new tip
manage_tips_tricks(tip_data)

# Update existing tip
manage_tips_tricks(tip_data, "tt_102")
```

## 🚀 Features

- ✅ **Dual Functionality**: Add new tips or update existing ones
- ✅ **Unique Tip ID Generation**: Auto-generated tip identifiers (tt_XXXXX)
- ✅ **Rich Content Support**: Banner images, icons, and structured points
- ✅ **Flexible Points Array**: Multiple tip points with icons and messages
- ✅ **Update Existing Tips**: Modify existing tips by providing tip_id
- ✅ **Comprehensive Validation**: Validates all required fields and data types
- ✅ **Error Handling**: Detailed error responses for all scenarios
- ✅ **No Authentication**: Public API for easy integration

## 🔒 Security Considerations

- **Input Validation**: All inputs are validated and sanitized
- **Data Type Validation**: Strict type checking for all fields
- **Array Validation**: Validates points array structure and content
- **URL Validation**: Ensures banner_url and icon URLs are provided
- **Error Information**: Limited error details to prevent information leakage

## 📊 Performance

- **Efficient Queries**: Indexed tip_id for fast lookups
- **Optimized Schema**: Well-structured data for quick retrieval
- **Minimal Data Transfer**: Only returns necessary confirmation data
- **Database Indexing**: Proper indexes on frequently queried fields

## 🎯 Use Cases

### 1. Vehicle Maintenance Tips
- Provide users with maintenance tips and tricks
- Display tips with visual icons and banners

### 2. Educational Content
- Share vehicle-related knowledge
- Create structured learning content

### 3. User Engagement
- Keep users engaged with helpful tips
- Provide value-added content

### 4. Content Management
- Manage and update tip content
- Track tip creation and updates

## 🔄 Database Operations

### Add New Tip
1. **Generate ID**: Create unique tip_id (tt_XXXXX)
2. **Validate Data**: Check all required fields and data types
3. **Create Document**: Insert new tip document
4. **Return Success**: Confirm tip creation with ID

### Update Existing Tip
1. **Find Tip**: Query by tip_id
2. **Verify Existence**: Check if tip exists
3. **Update Document**: Modify existing tip
4. **Return Success**: Confirm tip update

## 🧪 Testing

### Test Cases
1. **Add Valid Tip**: Should return success with tip_id
2. **Add Tip with Missing Fields**: Should return 400 with "Invalid parameter"
3. **Add Tip with Invalid Points**: Should return 400 with "Invalid parameter"
4. **Update Existing Tip**: Should return success
5. **Update Non-existent Tip**: Should return 404 with "invalid_id"
6. **Update with Missing tip_id**: Should return 400 with "Invalid parameter"

### Sample Test Data
```json
{
  "valid_tip_data": {
    "banner_url": "https://yourcdn.com/images/tyre-check.jpg",
    "title": "Tyre Maintenance Tips",
    "summary": "Tyres play a major role in road safety. Here are some quick maintenance tips.",
    "points": [
      {
        "icon": "https://yourcdn.com/icons/tyre-pressure.png",
        "message": "Check tyre pressure weekly."
      },
      {
        "icon": "https://yourcdn.com/icons/tyre-rotation.png",
        "message": "Rotate tyres every 10,000 km."
      }
    ]
  },
  "valid_tip_id": "tt_12345",
  "invalid_tip_id": "tt_99999"
}
```

## 🔧 Integration Notes

### Frontend Integration
- Handle both add and update operations
- Display success messages appropriately
- Implement error handling for all scenarios
- Show loading states during API calls

### Backend Integration
- Ensure proper image URLs are provided
- Validate points array structure
- Monitor tip creation and update frequency
- Implement content moderation if needed

## 📞 Support

For issues with the Vehicle Tips & Tricks API:
1. Verify all required fields are provided
2. Check points array structure and content
3. Ensure banner_url and icon URLs are valid
4. Review server logs for detailed error information
5. Verify database connection and indexes

## 🎉 Success!

This API provides comprehensive tips and tricks management with support for adding new tips and updating existing ones. The flexible structure with banner images, icons, and structured points makes it perfect for creating engaging vehicle maintenance content.

