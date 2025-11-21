# 🌟 YouTube Links for QR Service Benefits API Documentation

## ✨ Overview
This endpoint allows users to manipulate the QR service benefit videos list based on provided parameters. The program behaves differently depending on which parameters are provided, supporting add, update, and delete operations.

## 🔗 Endpoint
```
POST https://digivahan.in/api/qr-benefit-videos
```

## 🔐 Authentication
**No Authentication Required** - This is a public API endpoint.

## 🌐 HTTP Method
**POST**

## 📌 Request Parameters
The following parameters should be included in the request body:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tutorial_video_id` | string | Conditional | Unique ID of the video (required for update/delete) |
| `title` | string | Conditional | Title of the video (required for add/update) |
| `tutorial_video` | string | Conditional | URL of the video (required for add/update) |
| `tutorial_thumbnail` | string | No | Thumbnail URL for the video |

## 🧠 Backend Behavior

### Case 1: Update Video (All Parameters)
**When**: `tutorial_video_id`, `title`, and `tutorial_video` are provided
**Action**: Updates the existing video with the provided data

### Case 2: Add New Video (Title + Video URL)
**When**: `title` and `tutorial_video` are provided (no `tutorial_video_id`)
**Action**: Adds a new video to the list and assigns a unique `tutorial_video_id`

### Case 3: Delete Video (Video ID Only)
**When**: Only `tutorial_video_id` is provided
**Action**: Deletes the video with the specified ID

## 📤 Request Examples

### Case 1: Update Existing Video
```json
{
    "tutorial_video_id": "userdf234",
    "title": "QR Code Benefits Explained",
    "tutorial_video": "https://www.youtube.com/watch?v=abcd1234",
    "tutorial_thumbnail": "jhhjghghh"
}
```

### Case 2: Add New Video
```json
{
    "title": "QR Code Benefits Explained",
    "tutorial_video": "https://www.youtube.com/watch?v=abcd1234",
    "tutorial_thumbnail": "jhhjghghh"
}
```

### Case 3: Delete Video
```json
{
    "tutorial_video_id": "userdf234"
}
```

## 📥 Response Examples

### ✅ Success Responses

#### Case 1: Update Success
```json
{
  "success": true,
  "message": "User tutorial_video updated successfully"
}
```

#### Case 2: Add Success
```json
{
  "success": true,
  "message": "User tutorial_video added successfully"
}
```

#### Case 3: Delete Success
```json
{
  "success": true,
  "message": "User tutorial_video deleted successfully"
}
```

### ❌ Error Responses

#### Rate Limited / Server Issue
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

## 🔧 Technical Implementation

### Database Schema
```javascript
{
  tutorial_video_id: String,    // Unique identifier (qr_video_XXXXX)
  title: String,                // Video title
  tutorial_video: String,       // Video URL
  tutorial_thumbnail: String,   // Thumbnail URL (optional)
  created_at: Date,             // Creation timestamp
  updated_at: Date,             // Last update timestamp
  status: String,               // Video status (active/inactive/archived)
  views: Number,                // View count
  order: Number                 // Display order
}
```

### Validation Rules
- **tutorial_video_id**: 1-50 characters (when provided)
- **title**: 1-200 characters (when provided)
- **tutorial_video**: 1-500 characters (when provided)
- **tutorial_thumbnail**: 1-500 characters (optional)

### Unique ID Generation
- **Format**: `qr_video_XXXXX` (where XXXXX is a 5-digit random number)
- **Uniqueness**: Ensures no duplicate IDs in the database

## 📝 Usage Examples

### cURL Examples

#### Update Video
```bash
curl -X POST https://digivahan.in/api/qr-benefit-videos \
  -H "Content-Type: application/json" \
  -d '{
    "tutorial_video_id": "userdf234",
    "title": "QR Code Benefits Explained",
    "tutorial_video": "https://www.youtube.com/watch?v=abcd1234",
    "tutorial_thumbnail": "jhhjghghh"
  }'
```

#### Add New Video
```bash
curl -X POST https://digivahan.in/api/qr-benefit-videos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "QR Code Benefits Explained",
    "tutorial_video": "https://www.youtube.com/watch?v=abcd1234",
    "tutorial_thumbnail": "jhhjghghh"
  }'
```

#### Delete Video
```bash
curl -X POST https://digivahan.in/api/qr-benefit-videos \
  -H "Content-Type: application/json" \
  -d '{
    "tutorial_video_id": "userdf234"
  }'
```

### JavaScript Examples

#### Update Video
```javascript
const updateQRVideo = async (videoData) => {
  try {
    const response = await fetch('https://digivahan.in/api/qr-benefit-videos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(videoData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Video updated successfully');
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

// Usage
const videoData = {
  tutorial_video_id: "userdf234",
  title: "QR Code Benefits Explained",
  tutorial_video: "https://www.youtube.com/watch?v=abcd1234",
  tutorial_thumbnail: "jhhjghghh"
};

await updateQRVideo(videoData);
```

#### Add New Video
```javascript
const addQRVideo = async (videoData) => {
  try {
    const response = await fetch('https://digivahan.in/api/qr-benefit-videos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(videoData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Video added successfully');
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

// Usage
const newVideoData = {
  title: "QR Code Benefits Explained",
  tutorial_video: "https://www.youtube.com/watch?v=abcd1234",
  tutorial_thumbnail: "jhhjghghh"
};

await addQRVideo(newVideoData);
```

#### Delete Video
```javascript
const deleteQRVideo = async (videoId) => {
  try {
    const response = await fetch('https://digivahan.in/api/qr-benefit-videos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tutorial_video_id: videoId
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Video deleted successfully');
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

// Usage
await deleteQRVideo("userdf234");
```

### Python Examples

#### Update Video
```python
import requests
import json

def update_qr_video(video_data):
    url = "https://digivahan.in/api/qr-benefit-videos"
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, headers=headers, data=json.dumps(video_data))
        result = response.json()
        
        if result["success"]:
            print("Video updated successfully")
            return result
        else:
            print(f"Error: {result['message']}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"Network error: {e}")
        return None

# Usage
video_data = {
    "tutorial_video_id": "userdf234",
    "title": "QR Code Benefits Explained",
    "tutorial_video": "https://www.youtube.com/watch?v=abcd1234",
    "tutorial_thumbnail": "jhhjghghh"
}

update_qr_video(video_data)
```

## 🚀 Features

- ✅ **Multi-Operation Support**: Add, update, and delete operations in one endpoint
- ✅ **Smart Parameter Detection**: Automatically determines operation based on parameters
- ✅ **Unique ID Generation**: Auto-generated tutorial_video_id for new videos
- ✅ **Thumbnail Support**: Optional thumbnail URL for videos
- ✅ **Comprehensive Validation**: Validates all input parameters
- ✅ **Error Handling**: Detailed error responses for different scenarios
- ✅ **No Authentication**: Public API for easy integration

## 🔒 Security Considerations

- **Input Validation**: All inputs are validated and sanitized
- **Parameter Validation**: Strict validation based on operation type
- **Error Information**: Limited error details to prevent information leakage
- **Data Sanitization**: All string inputs are trimmed and validated

## 📊 Performance

- **Efficient Queries**: Indexed tutorial_video_id for fast lookups
- **Optimized Operations**: Direct database operations for each case
- **Minimal Data Transfer**: Only returns necessary confirmation data
- **Database Indexing**: Proper indexes on frequently queried fields

## 🎯 Use Cases

### 1. Video Management System
- Add new QR benefit videos
- Update existing video information
- Remove outdated videos

### 2. Content Management
- Manage video library for QR services
- Update video metadata and URLs
- Organize video content

### 3. Tutorial Management
- Add new tutorial videos
- Update video descriptions and links
- Remove obsolete tutorials

### 4. Educational Content
- Manage educational video content
- Update video resources
- Maintain video library

## 🔄 Additional Endpoints

The API also provides additional endpoints for enhanced functionality:

### Get All QR Videos
```
GET /api/qr-benefit-videos
```
- Fetch all QR benefit videos
- Supports pagination with limit and skip parameters

### Get QR Video by ID
```
GET /api/qr-benefit-videos/:tutorial_video_id
```
- Fetch specific QR video
- Increment view count automatically

## 🧪 Testing

### Test Cases
1. **Update Video**: Should update existing video with new data
2. **Add New Video**: Should add new video and assign unique ID
3. **Delete Video**: Should remove video with specified ID
4. **Invalid Parameters**: Should return 400 with "Invalid parameter"
5. **Video Not Found**: Should return 404 for non-existent video
6. **Missing Required Fields**: Should return 400 for incomplete data

### Sample Test Data
```json
{
  "update_video": {
    "tutorial_video_id": "userdf234",
    "title": "QR Code Benefits Explained",
    "tutorial_video": "https://www.youtube.com/watch?v=abcd1234",
    "tutorial_thumbnail": "jhhjghghh"
  },
  "add_video": {
    "title": "QR Code Benefits Explained",
    "tutorial_video": "https://www.youtube.com/watch?v=abcd1234",
    "tutorial_thumbnail": "jhhjghghh"
  },
  "delete_video": {
    "tutorial_video_id": "userdf234"
  }
}
```

## 🔧 Integration Notes

### Frontend Integration
- Handle different response formats for each operation
- Implement proper error handling for each case
- Provide user feedback for successful operations
- Validate input before sending requests

### Backend Integration
- Monitor API usage and performance
- Implement logging for video operations
- Consider implementing rate limiting
- Monitor database performance for video operations

## 📞 Support

For issues with the QR Benefit Videos API:
1. Verify parameter combinations are correct
2. Check tutorial_video_id exists for update/delete operations
3. Ensure required fields are provided for add/update operations
4. Validate video URLs are accessible
5. Review server logs for detailed error information

## 🎉 Success!

This API provides comprehensive QR service benefit video management functionality with smart parameter detection, supporting add, update, and delete operations through a single endpoint. The flexible parameter system and automatic operation detection make it perfect for managing video content libraries and educational resources.

