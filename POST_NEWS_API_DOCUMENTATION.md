# 📰 POST News API Documentation

## 🌟 Overview
This endpoint allows posting the latest news with banner images, news type categorization, heading, and HTML content. The API automatically generates unique news IDs and sets posting timestamps.

## 🔗 Endpoint
```
POST https://digivahan.in/api/admin/news-post
```

## 🔐 Authentication
**No Authentication Required** - This is a public API endpoint.

## 🌐 HTTP Method
**POST**

## 📌 Request Parameters
The following parameters should be included in the request body:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `banner` | string | Yes | URL or path to the news banner image |
| `news_type` | enum | Yes | News category (automotive, technology, safety, environment, business, government, general, breaking, featured) |
| `heading` | string | Yes | News heading/title |
| `news` | string (HTML) | Yes | News content in HTML format |

### News Type Enum Values
- `automotive` - Automotive industry news
- `technology` - Technology-related news
- `safety` - Safety and security news
- `environment` - Environmental news
- `business` - Business and finance news
- `government` - Government and policy news
- `general` - General news
- `breaking` - Breaking news
- `featured` - Featured news

## 📤 Request Example

```json
{
  "banner": "https://yourcdn.com/images/automotive-news-banner.jpg",
  "news_type": "automotive",
  "heading": "New Electric Vehicle Technology Revolutionizes Transportation",
  "news": "<h2>Revolutionary EV Technology</h2><p>In a groundbreaking development, automotive manufacturers have unveiled new electric vehicle technology that promises to revolutionize transportation. The new system features:</p><ul><li>Extended battery life up to 500 miles</li><li>Fast charging in under 15 minutes</li><li>Advanced autonomous driving capabilities</li></ul><p>This technology is expected to be available in production vehicles by 2025.</p>"
}
```

## 📥 Response Examples

### ✅ Success Response
```json
{
  "status": true,
  "message": "News posted successfully."
}
```

### ❌ Error Response
```json
{
  "status": false,
  "message": "Failed to post news."
}
```

## 🧠 Backend Logic

### Process Flow
1. **Parameter Validation**: Validate all required fields and data types
2. **News Type Validation**: Verify news_type is a valid enum value
3. **Data Sanitization**: Trim and validate string fields
4. **News ID Generation**: Generate unique news_id in format `news_XXXXX`
5. **Timestamp Setting**: Set posting_date to current timestamp
6. **Database Save**: Save news to News collection
7. **Response**: Return success confirmation

### Database Operations
- **Generate ID**: Create unique news_id (news_XXXXX format)
- **Set Timestamp**: Set posting_date to current timestamp
- **Create Document**: Insert new news document
- **Return Success**: Confirm news creation

## 🔧 Technical Implementation

### Database Schema
```javascript
{
  news_id: String,           // Unique identifier (news_XXXXX)
  banner: String,            // Banner image URL/path
  news_type: String,         // News category (enum)
  heading: String,           // News heading/title
  news: String,              // News content (HTML)
  posting_date: Date,        // Posting timestamp
  created_at: Date,          // Creation timestamp
  updated_at: Date,          // Last update timestamp
  status: String,            // News status (draft/published/archived)
  views: Number,             // View count
  tags: [String]             // News tags
}
```

### Validation Rules
- **banner**: Required, 1-500 characters
- **news_type**: Required, must be valid enum value
- **heading**: Required, 1-200 characters
- **news**: Required, 1-10000 characters (HTML content)

### News Type Categories
The API supports the following news categories:
- **automotive**: Automotive industry news
- **technology**: Technology-related news
- **safety**: Safety and security news
- **environment**: Environmental news
- **business**: Business and finance news
- **government**: Government and policy news
- **general**: General news
- **breaking**: Breaking news
- **featured**: Featured news

## 📝 Usage Examples

### cURL Example
```bash
curl -X POST https://digivahan.in/api/admin/news-post \
  -H "Content-Type: application/json" \
  -d '{
    "banner": "https://yourcdn.com/images/automotive-news-banner.jpg",
    "news_type": "automotive",
    "heading": "New Electric Vehicle Technology Revolutionizes Transportation",
    "news": "<h2>Revolutionary EV Technology</h2><p>In a groundbreaking development, automotive manufacturers have unveiled new electric vehicle technology that promises to revolutionize transportation. The new system features:</p><ul><li>Extended battery life up to 500 miles</li><li>Fast charging in under 15 minutes</li><li>Advanced autonomous driving capabilities</li></ul><p>This technology is expected to be available in production vehicles by 2025.</p>"
  }'
```

### JavaScript Example
```javascript
const postNews = async (newsData) => {
  try {
    const response = await fetch('https://digivahan.in/api/admin/news-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newsData)
    });

    const result = await response.json();
    
    if (result.status) {
      console.log('News posted successfully');
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
const newsData = {
  banner: "https://yourcdn.com/images/automotive-news-banner.jpg",
  news_type: "automotive",
  heading: "New Electric Vehicle Technology Revolutionizes Transportation",
  news: "<h2>Revolutionary EV Technology</h2><p>In a groundbreaking development, automotive manufacturers have unveiled new electric vehicle technology that promises to revolutionize transportation. The new system features:</p><ul><li>Extended battery life up to 500 miles</li><li>Fast charging in under 15 minutes</li><li>Advanced autonomous driving capabilities</li></ul><p>This technology is expected to be available in production vehicles by 2025.</p>"
};

await postNews(newsData);
```

### Python Example
```python
import requests
import json

def post_news(news_data):
    url = "https://digivahan.in/api/admin/news-post"
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, headers=headers, data=json.dumps(news_data))
        result = response.json()
        
        if result["status"]:
            print("News posted successfully")
            return result
        else:
            print(f"Error: {result['message']}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"Network error: {e}")
        return None

# Usage
news_data = {
    "banner": "https://yourcdn.com/images/automotive-news-banner.jpg",
    "news_type": "automotive",
    "heading": "New Electric Vehicle Technology Revolutionizes Transportation",
    "news": "<h2>Revolutionary EV Technology</h2><p>In a groundbreaking development, automotive manufacturers have unveiled new electric vehicle technology that promises to revolutionize transportation. The new system features:</p><ul><li>Extended battery life up to 500 miles</li><li>Fast charging in under 15 minutes</li><li>Advanced autonomous driving capabilities</li></ul><p>This technology is expected to be available in production vehicles by 2025.</p>"
}

post_news(news_data)
```

## 🚀 Features

- ✅ **Rich Content Support**: HTML content support for formatted news
- ✅ **News Categorization**: 9 different news types for proper organization
- ✅ **Banner Images**: Support for news banner images
- ✅ **Unique ID Generation**: Auto-generated news identifiers (news_XXXXX)
- ✅ **Automatic Timestamps**: Sets posting date automatically
- ✅ **Comprehensive Validation**: Validates all required fields and data types
- ✅ **Error Handling**: Detailed error responses
- ✅ **No Authentication**: Public API for easy integration

## 🔒 Security Considerations

- **Input Validation**: All inputs are validated and sanitized
- **HTML Content**: Accepts HTML content for rich formatting
- **Data Type Validation**: Strict type checking for all fields
- **Enum Validation**: Validates news_type against allowed values
- **Error Information**: Limited error details to prevent information leakage

## 📊 Performance

- **Efficient Queries**: Indexed news_id for fast lookups
- **Optimized Schema**: Well-structured data for quick retrieval
- **Minimal Data Transfer**: Only returns necessary confirmation data
- **Database Indexing**: Proper indexes on frequently queried fields

## 🎯 Use Cases

### 1. News Management System
- Post breaking news and updates
- Categorize news by type for better organization

### 2. Content Management
- Create and manage news articles
- Support rich HTML content for formatting

### 3. News Aggregation
- Collect news from various sources
- Organize news by categories

### 4. Media Platform
- Publish news articles with banners
- Support different news types and formats

## 🔄 Database Operations

### Add New News
1. **Generate ID**: Create unique news_id (news_XXXXX)
2. **Validate Data**: Check all required fields and data types
3. **Set Timestamp**: Set posting_date to current timestamp
4. **Create Document**: Insert new news document
5. **Return Success**: Confirm news creation

### Additional Endpoints
The API also provides additional endpoints for news management:
- **GET /api/admin/news** - Get all news
- **GET /api/admin/news/:news_id** - Get specific news
- **PUT /api/admin/news/:news_id** - Update news
- **DELETE /api/admin/news/:news_id** - Delete news

## 🧪 Testing

### Test Cases
1. **Post Valid News**: Should return success
2. **Post News with Missing Fields**: Should return 400 with "Failed to post news"
3. **Post News with Invalid Type**: Should return 400 with "Failed to post news"
4. **Post News with Empty Fields**: Should return 400 with "Failed to post news"
5. **Post News with Long Content**: Should return 400 if exceeds limit

### Sample Test Data
```json
{
  "valid_news_data": {
    "banner": "https://yourcdn.com/images/automotive-news-banner.jpg",
    "news_type": "automotive",
    "heading": "New Electric Vehicle Technology Revolutionizes Transportation",
    "news": "<h2>Revolutionary EV Technology</h2><p>In a groundbreaking development, automotive manufacturers have unveiled new electric vehicle technology that promises to revolutionize transportation.</p>"
  },
  "invalid_news_type": "invalid_type",
  "empty_fields": {
    "banner": "",
    "news_type": "automotive",
    "heading": "",
    "news": ""
  }
}
```

## 🔧 Integration Notes

### Frontend Integration
- Handle success and error responses appropriately
- Implement form validation for news fields
- Support HTML content editing for news field
- Display appropriate error messages

### Backend Integration
- Ensure proper image URLs are provided for banners
- Validate HTML content for security
- Monitor news posting frequency
- Implement content moderation if needed

## 📞 Support

For issues with the POST News API:
1. Verify all required fields are provided
2. Check news_type is a valid enum value
3. Ensure banner URL is accessible
4. Validate HTML content format
5. Review server logs for detailed error information

## 🎉 Success!

This API provides comprehensive news posting functionality with support for rich content, categorization, and automatic timestamp management. The flexible structure with HTML content support makes it perfect for creating engaging news articles with proper organization and formatting.

