# 📚 GET News API Documentation

## 🌟 Overview
This endpoint allows users to fetch all news with pagination support. Users can fetch a selected number of news articles from the database with optional filtering by news type.

## 🔗 Endpoint
```
GET https://digivahan.in/api/user/news/list
```

## 🔐 Authentication
**No Authentication Required** - This is a public API endpoint.

## 🌐 HTTP Method
**GET**

## 📌 Query Parameters
The following optional parameters can be included in the query string:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | integer | No | 10 | Number of news articles to fetch (1-100) |
| `page` | integer | No | 1 | Page number for pagination (starts from 1) |
| `news_type` | string | No | null | Filter by news type (automotive, technology, safety, environment, business, government, general, breaking, featured) |

### News Type Filter Options
- `automotive` - Automotive industry news
- `technology` - Technology-related news
- `safety` - Safety and security news
- `environment` - Environmental news
- `business` - Business and finance news
- `government` - Government and policy news
- `general` - General news
- `breaking` - Breaking news
- `featured` - Featured news

## 📤 Request Examples

### Basic Request (Default Pagination)
```
GET https://digivahan.in/api/user/news/list
```

### With Pagination
```
GET https://digivahan.in/api/user/news/list?limit=5&page=2
```

### With News Type Filter
```
GET https://digivahan.in/api/user/news/list?news_type=automotive&limit=10&page=1
```

### Combined Parameters
```
GET https://digivahan.in/api/user/news/list?limit=20&page=1&news_type=technology
```

## 📥 Response Examples

### ✅ Success Response
```json
{
  "status": true,
  "message": "News list fetched successfully.",
  "data": [
    {
      "news_id": "nw_202",
      "banner": "https://yourcdn.com/images/news-banner.jpg",
      "posting_date": "2025-08-08",
      "news_type": "automotive",
      "heading": "New Vehicle Tax Rules Announced",
      "sub_description": "The government has updated the vehicle tax slabs for the upcoming fiscal year. This change will affect both commercial and personal vehicles across the country.",
      "description": "ssfasfasfasfafas"
    },
    {
      "news_id": "nw_203",
      "banner": "https://yourcdn.com/images/fuel-price.jpg",
      "posting_date": "2025-08-06",
      "news_type": "business",
      "heading": "Fuel Prices Drop This Week",
      "sub_description": "Due to global crude price drop, fuel prices in major Indian cities have seen a reduction.",
      "description": "ssfasfasfasfafas"
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

## 🧠 Backend Logic

### Process Flow
1. **Parameter Validation**: Validate limit, page, and news_type parameters
2. **Pagination Calculation**: Calculate skip value based on page and limit
3. **Query Building**: Build database query with filters
4. **Data Retrieval**: Fetch news from database with pagination
5. **Data Formatting**: Format response data with proper date formatting
6. **Response**: Return formatted news list

### Database Operations
- **Query Filter**: Filter by status="published" and optional news_type
- **Pagination**: Apply limit and skip for pagination
- **Sorting**: Sort by posting_date (latest first)
- **Field Selection**: Select only required fields for list view
- **Date Formatting**: Convert posting_date to YYYY-MM-DD format

## 🔧 Technical Implementation

### Response Data Structure
```javascript
{
  news_id: String,           // Unique news identifier
  banner: String,            // Banner image URL
  posting_date: String,      // Posting date (YYYY-MM-DD format)
  news_type: String,         // News category
  heading: String,           // News heading/title
  sub_description: String,   // Brief description
  description: String        // Detailed description
}
```

### Pagination Logic
- **Default Values**: limit=10, page=1
- **Skip Calculation**: skip = (page - 1) * limit
- **Validation**: limit (1-100), page (≥1)
- **Sorting**: Latest news first (posting_date descending)

### Query Parameters Validation
- **limit**: Must be integer between 1 and 100
- **page**: Must be positive integer
- **news_type**: Must be valid enum value or empty

## 📝 Usage Examples

### cURL Examples

#### Basic Request
```bash
curl -X GET "https://digivahan.in/api/user/news/list"
```

#### With Pagination
```bash
curl -X GET "https://digivahan.in/api/user/news/list?limit=5&page=2"
```

#### With News Type Filter
```bash
curl -X GET "https://digivahan.in/api/user/news/list?news_type=automotive&limit=10"
```

### JavaScript Examples

#### Basic Fetch
```javascript
const getNewsList = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `https://digivahan.in/api/user/news/list${queryString ? '?' + queryString : ''}`;
    
    const response = await fetch(url);
    const result = await response.json();
    
    if (result.status) {
      console.log('News fetched successfully:', result.data);
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
await getNewsList(); // Default pagination
await getNewsList({ limit: 5, page: 2 }); // Custom pagination
await getNewsList({ news_type: 'automotive' }); // Filter by type
await getNewsList({ limit: 20, page: 1, news_type: 'technology' }); // Combined
```

#### With Pagination Handling
```javascript
const getNewsWithPagination = async (page = 1, limit = 10, newsType = null) => {
  try {
    const params = { page, limit };
    if (newsType) params.news_type = newsType;
    
    const result = await getNewsList(params);
    
    if (result) {
      return {
        news: result,
        currentPage: page,
        hasNextPage: result.length === limit,
        hasPrevPage: page > 1
      };
    }
    
    return null;
  } catch (error) {
    console.error('Pagination error:', error);
    return null;
  }
};
```

### Python Examples

#### Basic Request
```python
import requests

def get_news_list(limit=10, page=1, news_type=None):
    url = "https://digivahan.in/api/user/news/list"
    
    params = {
        'limit': limit,
        'page': page
    }
    
    if news_type:
        params['news_type'] = news_type
    
    try:
        response = requests.get(url, params=params)
        result = response.json()
        
        if result["status"]:
            print("News fetched successfully")
            return result["data"]
        else:
            print(f"Error: {result['message']}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"Network error: {e}")
        return None

# Usage examples
news = get_news_list()  # Default pagination
news = get_news_list(limit=5, page=2)  # Custom pagination
news = get_news_list(news_type='automotive')  # Filter by type
```

## 🚀 Features

- ✅ **Pagination Support**: Configurable limit and page parameters
- ✅ **News Type Filtering**: Filter news by category
- ✅ **Latest First**: News sorted by posting date (newest first)
- ✅ **Optimized Queries**: Only fetch required fields for list view
- ✅ **Date Formatting**: Consistent date format (YYYY-MM-DD)
- ✅ **Parameter Validation**: Comprehensive input validation
- ✅ **Error Handling**: Detailed error responses
- ✅ **No Authentication**: Public API for easy access

## 🔒 Security Considerations

- **Input Validation**: All query parameters are validated
- **SQL Injection Protection**: Uses Mongoose ODM for safe queries
- **Rate Limiting**: Consider implementing rate limiting for production
- **Data Sanitization**: All inputs are sanitized and validated
- **Error Information**: Limited error details to prevent information leakage

## 📊 Performance

- **Efficient Queries**: Indexed fields for fast retrieval
- **Field Selection**: Only fetch required fields for list view
- **Pagination**: Prevents large data transfers
- **Database Indexing**: Proper indexes on frequently queried fields
- **Caching**: Consider implementing caching for frequently accessed data

## 🎯 Use Cases

### 1. News Feed
- Display latest news in mobile/web applications
- Implement infinite scroll with pagination

### 2. News Categories
- Filter news by specific categories
- Create category-specific news pages

### 3. News Management
- Browse through news articles
- Implement search and filter functionality

### 4. Content Aggregation
- Aggregate news from various sources
- Display news in organized format

## 🔄 Additional Endpoints

The API also provides additional endpoints for enhanced functionality:

### Get News by ID
```
GET /api/user/news/:news_id
```
- Fetch specific news article with full content
- Increment view count automatically

### Get News by Type
```
GET /api/user/news/type/:news_type
```
- Fetch news filtered by specific type
- Supports pagination parameters

## 🧪 Testing

### Test Cases
1. **Basic Request**: Should return default pagination (10 items, page 1)
2. **Custom Pagination**: Should return specified limit and page
3. **News Type Filter**: Should return only news of specified type
4. **Invalid Parameters**: Should return 400 with "Invalid parameter"
5. **Large Limit**: Should return 400 if limit > 100
6. **Invalid Page**: Should return 400 if page < 1
7. **Invalid News Type**: Should return 400 if news_type is invalid

### Sample Test URLs
```
# Valid requests
GET /api/user/news/list
GET /api/user/news/list?limit=5&page=2
GET /api/user/news/list?news_type=automotive
GET /api/user/news/list?limit=20&page=1&news_type=technology

# Invalid requests
GET /api/user/news/list?limit=101  # Should return 400
GET /api/user/news/list?page=0     # Should return 400
GET /api/user/news/list?news_type=invalid  # Should return 400
```

## 🔧 Integration Notes

### Frontend Integration
- Handle pagination state management
- Implement loading states for better UX
- Cache news data for offline access
- Implement pull-to-refresh functionality

### Backend Integration
- Monitor API usage and performance
- Implement caching for frequently accessed data
- Consider implementing rate limiting
- Monitor database query performance

## 📞 Support

For issues with the GET News API:
1. Verify query parameters are valid
2. Check news_type is a valid enum value
3. Ensure limit is between 1 and 100
4. Verify page is a positive number
5. Review server logs for detailed error information

## 🎉 Success!

This API provides comprehensive news fetching functionality with pagination support, news type filtering, and optimized data retrieval. The flexible pagination system and filtering options make it perfect for building news feeds, category pages, and content management systems.

