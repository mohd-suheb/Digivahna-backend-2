# ⭐ Review Submission API Documentation

## 🌟 API Endpoint: Submit Review

### ✨ Introduction

This endpoint allows users to submit a review for a specific product. It accepts various parameters related to the user and the review content, and it returns a success status upon successful submission.

---

## 🔗 Endpoint

```
POST https://digivahan.in/api/review-submit
```

## 🔐 Authentication Details

**No Authentication Required**

## 🌐 HTTP Method

**POST**

---

## 📌 Request Parameters

### Required Parameters

| Parameter      | Type   | Description                                                |
| -------------- | ------ | ---------------------------------------------------------- |
| `user_id`      | string | The ID of the user submitting the review                   |
| `order_id`     | string | The Order ID related to the product being reviewed         |
| `product_type` | string | The Product ID of the item that is being reviewed          |
| `rating`       | number | The rating given to the product (0 to 5, e.g., 4.5)        |
| `review_title` | string | A short and catchy title for the review (3-200 characters) |
| `review_text`  | string | The actual content of the review (10-5000 characters)      |

### Optional Parameters

| Parameter           | Type    | Description                                                                  |
| ------------------- | ------- | ---------------------------------------------------------------------------- |
| `media_files`       | array   | An optional array of URLs pointing to images or videos related to the review |
| `verified_purchase` | boolean | Whether the review is from a verified purchase                               |

---

## 📤 Request Example

```json
{
  "user_id": "USR987654321",
  "order_id": "ORD_12345",
  "product_type": "PROD001",
  "rating": 4.5,
  "review_title": "Great product with amazing quality!",
  "review_text": "This product exceeded my expectations. The quality is excellent and delivery was prompt. Highly recommended!",
  "media_files": [
    "https://example.com/image1.jpg",
    "https://example.com/video1.mp4"
  ],
  "verified_purchase": true
}
```

---

## 📥 Response Samples

### ✅ On Success

```json
{
  "status": "true",
  "message": "Review submitted successfully"
}
```

---

### ❌ On Failure

#### Review Already Submitted

```json
{
  "status": false,
  "error_type": "other",
  "message": "Review already submitted"
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

#### Server Error

```json
{
  "status": false,
  "error_type": "other",
  "message": "Server Issue."
}
```

---

## 📋 Validation Rules

### Rating

- Must be between 0 and 5
- Can be a decimal value (e.g., 4.5)
- Required field

### Review Title

- Minimum length: 3 characters
- Maximum length: 200 characters
- Required field

### Review Text

- Minimum length: 10 characters
- Maximum length: 5000 characters
- Required field

### Media Files (Optional)

- Must be an array of valid URLs
- Each URL must start with `http://` or `https://`
- Can contain image or video URLs

### Verified Purchase (Optional)

- Must be a boolean value
- Default: `false`

---

## 🔍 Business Logic

### Duplicate Review Prevention

- The system checks if a review already exists for the same `user_id`, `order_id`, and `product_type`
- If a review already exists, returns error: "Review already submitted"
- Prevents users from submitting multiple reviews for the same order/product

### Review Status

- All reviews start with status: `pending`
- Reviews can be moderated and approved/rejected later
- Only approved reviews are displayed in public listings

### Database Storage

- Reviews are stored in the `reviews` collection
- Each review has a unique combination of `user_id`, `order_id`, and `product_type`
- Timestamps are automatically managed (`created_at`, `updated_at`)

---

## 🚫 Error Scenarios

| Error Scenario              | Status Code | Error Type        | Message                            |
| --------------------------- | ----------- | ----------------- | ---------------------------------- |
| Invalid user_id             | 400         | Invalid parameter | You have entered invalid parameter |
| Invalid order_id            | 400         | Invalid parameter | You have entered invalid parameter |
| Invalid product_type        | 400         | Invalid parameter | You have entered invalid parameter |
| Invalid rating              | 400         | Invalid parameter | You have entered invalid parameter |
| Rating out of range         | 400         | Invalid parameter | You have entered invalid parameter |
| Review title too short/long | 400         | Invalid parameter | You have entered invalid parameter |
| Review text too short/long  | 400         | Invalid parameter | You have entered invalid parameter |
| Invalid media file URL      | 400         | Invalid parameter | You have entered invalid parameter |
| Review already exists       | 400         | other             | Review already submitted           |
| Server error                | 500         | other             | Server Issue.                      |

---

## 📝 Additional Endpoints

### 1. Get Product Reviews

Get all reviews for a specific product

**Endpoint:** `GET /api/reviews/:product_type`

**Query Parameters:**

- `limit` (optional): Number of reviews per page (default: 50)
- `skip` (optional): Number of reviews to skip (default: 0)
- `rating` (optional): Filter by specific rating (1-5)

**Example:**

```
GET /api/reviews/PROD001?limit=20&skip=0&rating=5
```

---

### 2. Get User Reviews

Get all reviews submitted by a specific user

**Endpoint:** `GET /api/reviews/user/:user_id`

**Query Parameters:**

- `limit` (optional): Number of reviews per page (default: 50)
- `skip` (optional): Number of reviews to skip (default: 0)

**Example:**

```
GET /api/reviews/user/USR987654321?limit=10
```

---

### 3. Get Average Rating

Get rating statistics for a specific product

**Endpoint:** `GET /api/reviews/rating/:product_type`

**Response:**

```json
{
  "status": true,
  "message": "Rating statistics retrieved successfully",
  "data": {
    "averageRating": 4.5,
    "totalReviews": 150,
    "ratingDistribution": {
      "5": 75,
      "4": 50,
      "3": 20,
      "2": 5,
      "1": 0
    }
  }
}
```

---

## 🎯 Notes

1. **Media is Optional:** Images & videos can be included as URLs (use cloud storage or multipart file upload)
2. **Duplicate Prevention:** If same user tries to review same product or order again, returns an error: "Review already submitted"
3. **Required Fields:** Ensure that all required fields are provided in the request to avoid errors
4. **Media Enhancement:** The media_file parameter is optional; however, including it can enhance the review's visibility
5. **Review Moderation:** Reviews start with "pending" status and need approval before being public
6. **User Feedback:** This endpoint facilitates user feedback, which can help improve product offerings and customer satisfaction

---

## 🔧 Response Status Codes

| Code | Meaning                                              |
| ---- | ---------------------------------------------------- |
| 200  | Success - Review submitted successfully              |
| 400  | Bad Request - Invalid parameters or duplicate review |
| 500  | Server Error - Internal server error                 |

---

## 📊 Database Schema

### Review Collection (`reviews`)

```javascript
{
  user_id: String (required, indexed),
  order_id: String (required, indexed),
  product_type: String (required, indexed),
  rating: Number (required, 0-5),
  review_title: String (required, max 200 chars),
  review_text: String (required, max 5000 chars),
  media_files: Array of Strings (optional),
  helpful_count: Number (default: 0),
  verified_purchase: Boolean (default: false),
  status: String (enum: pending, approved, rejected, hidden),
  admin_remarks: String (optional),
  created_at: Date (auto),
  updated_at: Date (auto)
}
```

### Indexes

- `{ user_id, order_id, product_type }` - Unique index (prevents duplicates)
- `{ product_type, status }` - For filtering approved reviews
- `{ rating }` - For rating-based queries
- `{ created_at }` - For sorting by date

---

## 🧪 Testing Examples

### Example 1: Submit a Basic Review

```json
POST /api/review-submit

{
  "user_id": "USR123",
  "order_id": "ORD001",
  "product_type": "PROD001",
  "rating": 5,
  "review_title": "Amazing Product!",
  "review_text": "This is one of the best products I've ever purchased. Highly recommend!"
}
```

### Example 2: Submit a Review with Media

```json
POST /api/review-submit

{
  "user_id": "USR123",
  "order_id": "ORD002",
  "product_type": "PROD002",
  "rating": 4.5,
  "review_title": "Good value for money",
  "review_text": "Product quality is good and delivery was fast.",
  "media_files": [
    "https://storage.example.com/reviews/image1.jpg",
    "https://storage.example.com/reviews/image2.jpg"
  ],
  "verified_purchase": true
}
```

### Example 3: Submit a Review with Low Rating

```json
POST /api/review-submit

{
  "user_id": "USR124",
  "order_id": "ORD003",
  "product_type": "PROD001",
  "rating": 2,
  "review_title": "Below expectations",
  "review_text": "The product did not meet the advertised specifications. Customer service could be improved."
}
```

---

## ✅ Implementation Status

- ✅ Model created with proper validation
- ✅ Controller with submitReview function
- ✅ Route registration
- ✅ Duplicate review prevention
- ✅ Validation middleware
- ✅ Error handling
- ✅ Database indexing for performance
- ✅ Additional endpoints for retrieving reviews
- ✅ Rating statistics calculation

---

## 🚀 Ready to Use!

The Review Submission API is now fully implemented and ready for use. It includes:

- ✅ Complete review submission with validation
- ✅ Duplicate review prevention
- ✅ Media file support (URLs)
- ✅ Rating statistics
- ✅ Product and user review retrieval
- ✅ Proper error handling
- ✅ Database optimization

**Happy Reviewing! ⭐**
