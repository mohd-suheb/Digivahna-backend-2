# ⭐ User Feedback API Documentation

## 🌟 API Endpoint: Fetch User Reviews

### ✨ Introduction

This endpoint allows users to find out the reviews as per the pagination limits and requests. Fetches all user feedbacks from the database and returns them in JSON format. Used for displaying user reviews/feedbacks in the app or admin panel.

---

## 🔗 Endpoint

```
POST https://digivahan.in/api/user-feedback
```

## 🔐 Authentication Details

**No Authentication Required**

## 🌐 HTTP Method

**POST**

---

## 📌 Request Parameters

### Required Parameters

| Parameter     | Type   | Description                                           |
| ------------- | ------ | ----------------------------------------------------- |
| `review_type` | enum   | Accepts values: `app`, `qr`, `service_history`, `all` |
| `limits`      | number | Number of reviews to return per page                  |
| `page`        | number | Page number for pagination                            |

### Optional Parameters

None (all parameters are required)

---

## 📤 Request Example

```json
{
  "review_type": "app",
  "limits": "8",
  "page": "2"
}
```

**Note:** `limits` and `page` are passed as strings but will be converted to numbers.

---

## 📥 Response Samples

### ✅ On Success

```json
{
  "status": true,
  "message": "User feedbacks fetched successfully",
  "data": [
    {
      "reviewId": "507f1f77bcf86cd799439011",
      "userId": "U123",
      "review_type": "app",
      "user_name": "ASH",
      "user_rating": 5,
      "user_review_message": "The detailed information gave me the complete peace of mind about buying a used car",
      "date": "2025-08-09"
    },
    {
      "reviewId": "507f1f77bcf86cd799439012",
      "userId": "U124",
      "review_type": "app",
      "user_name": "ASH",
      "user_rating": 5,
      "user_review_message": "The detailed information gave me the complete peace of mind about buying a used car",
      "date": "2025-08-08"
    }
  ]
}
```

---

### ❌ On Failure

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

#### Invalid Review Type

```json
{
  "status": false,
  "error_type": "Invalid parameter",
  "message": "You have entered invalid parameter"
}
```

#### Invalid Limits

```json
{
  "status": false,
  "error_type": "Invalid parameter",
  "message": "You have entered invalid parameter"
}
```

#### Invalid Page

```json
{
  "status": false,
  "error_type": "Invalid parameter",
  "message": "You have entered invalid parameter"
}
```

---

## 📋 Validation Rules

### Review Type

- Must be one of: `app`, `qr`, `service_history`, `all`
- If `all` is selected, returns reviews of all types
- Required parameter

### Limits

- Must be a positive number
- Greater than 0
- Required parameter

### Page

- Must be at least 1
- Required parameter

---

## 🔍 Business Logic

### Pagination Calculation

```
skip = (page - 1) * limits
```

**Example:**

- `page = 2`, `limits = 8`
- `skip = (2 - 1) * 8 = 8`
- Returns reviews 9-16

### Review Type Filtering

- `app` - Returns only app reviews
- `qr` - Returns only QR-related reviews
- `service_history` - Returns only service history reviews
- `all` - Returns all reviews (no filtering)

### Sorting

- Reviews are sorted by `date` (descending)
- Most recent reviews appear first

### Data Transformation

The API transforms database reviews to match the required response format:

- `reviewId` - MongoDB `_id` as string
- `userId` - User ID from database
- `review_type` - Review type (app, qr, service_history, etc.)
- `user_name` - User name
- `user_rating` - User rating (0-5)
- `user_review_message` - Review message/text
- `date` - Formatted as YYYY-MM-DD

---

## 🚫 Error Scenarios

| Error Scenario                  | Status Code | Error Type        | Message                            |
| ------------------------------- | ----------- | ----------------- | ---------------------------------- |
| Missing `review_type`           | 400         | Invalid parameter | You have entered invalid parameter |
| Invalid `review_type`           | 400         | Invalid parameter | You have entered invalid parameter |
| Missing `limits`                | 400         | Invalid parameter | You have entered invalid parameter |
| Invalid `limits` (not a number) | 400         | Invalid parameter | You have entered invalid parameter |
| `limits` <= 0                   | 400         | Invalid parameter | You have entered invalid parameter |
| Missing `page`                  | 400         | Invalid parameter | You have entered invalid parameter |
| Invalid `page` (not a number)   | 400         | Invalid parameter | You have entered invalid parameter |
| `page` < 1                      | 400         | Invalid parameter | You have entered invalid parameter |
| Server error                    | 500         | other             | Server not working.                |

---

## 📝 Request Examples

### Example 1: Get App Reviews (Page 1)

```json
POST /api/user-feedback

{
  "review_type": "app",
  "limits": "10",
  "page": "1"
}
```

### Example 2: Get QR Reviews (Page 2)

```json
POST /api/user-feedback

{
  "review_type": "qr",
  "limits": "8",
  "page": "2"
}
```

### Example 3: Get All Reviews

```json
POST /api/user-feedback

{
  "review_type": "all",
  "limits": "20",
  "page": "1"
}
```

### Example 4: Get Service History Reviews

```json
POST /api/user-feedback

{
  "review_type": "service_history",
  "limits": "15",
  "page": "1"
}
```

---

## 🧠 Backend Impact

### Database Query

- Fetches reviews from `reviews` collection
- Applies filtering based on `review_type`
- Applies pagination using `limits` and calculated `skip`
- Sorts by `date` in descending order (newest first)
- Returns all matching reviews up to the specified limit

### Performance

- Uses database indexes for efficient queries
- Index on `review_type` for fast filtering
- Index on `date` for fast sorting
- Pagination reduces data transfer

### Data Transformation

- Maps database fields to required response format
- Converts `_id` to `reviewId`
- Formats date to YYYY-MM-DD
- Handles missing fields gracefully with defaults

---

## 📊 Response Fields

Each review in the response contains:

| Field                 | Type   | Description                                      |
| --------------------- | ------ | ------------------------------------------------ |
| `reviewId`            | string | MongoDB document ID                              |
| `userId`              | string | User ID who wrote the review                     |
| `review_type`         | string | Type of review (app, qr, service_history, other) |
| `user_name`           | string | Name of the user                                 |
| `user_rating`         | number | Rating given by user (0-5)                       |
| `user_review_message` | string | Review text/message                              |
| `date`                | string | Review date in YYYY-MM-DD format                 |

---

## ✅ Success Response Structure

```json
{
  "status": true,
  "message": "User feedbacks fetched successfully",
  "data": [
    {
      "reviewId": "...",
      "userId": "...",
      "review_type": "...",
      "user_name": "...",
      "user_rating": 5,
      "user_review_message": "...",
      "date": "2025-08-09"
    }
  ]
}
```

---

## ❌ Error Response Structure

```json
{
  "status": false,
  "error_type": "Invalid parameter | other",
  "message": "You have entered invalid parameter | Server not working."
}
```

---

## 🔧 Additional Notes

### Pagination Support

- Pagination is fully supported via `limit` and `page` parameters
- Page numbers start at 1
- Empty results if no reviews exist for the filter

### Review Type Enum

- `app` - Application reviews
- `qr` - QR code related reviews
- `service_history` - Service history reviews
- `all` - All review types (no filtering)

### Date Format

- Dates are formatted as YYYY-MM-DD
- Uses the review's `date` field if available
- Falls back to `created_at` timestamp if `date` is not set

---

## 🧪 Testing Scenarios

1. ✅ Get app reviews with pagination
2. ✅ Get QR reviews with pagination
3. ✅ Get service history reviews
4. ✅ Get all reviews (no filter)
5. ✅ Invalid review_type (should fail)
6. ✅ Missing limits (should fail)
7. ✅ Invalid limits (should fail)
8. ✅ Missing page (should fail)
9. ✅ Invalid page < 1 (should fail)
10. ✅ Page beyond available data (empty result)

---

## ✅ Implementation Status

- ✅ Model updated with review_type and additional fields
- ✅ Controller function `getUserFeedback()` created
- ✅ Route registered for POST /api/user-feedback
- ✅ Pagination logic implemented
- ✅ Validation middleware added
- ✅ Error handling implemented
- ✅ Data transformation to required format
- ✅ Database indexing for performance

---

## 🚀 Ready to Use!

The User Feedback API is now fully implemented and ready for use:

- ✅ Fetch reviews by type (app, qr, service_history, all)
- ✅ Pagination support (limits and page)
- ✅ Proper data transformation
- ✅ Error handling
- ✅ Validation
- ✅ Performance optimization with indexes

**Happy Testing! ⭐**
