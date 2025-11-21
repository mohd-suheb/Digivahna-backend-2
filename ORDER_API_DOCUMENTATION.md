# 📦 Order Management API Documentation

## 🌟 API Endpoints

### 1. Create Order

Create a new order and sync with ShipRocket

**Endpoint:** `POST /api/orders`  
**Authentication:** Not Required

#### Request Body

```json
{
  "user_id": "fddsscdscds",
  "transaction_id": "xcdccscds",
  "vehicle_id": "xcdccscds",
  "order_for": "vehicle: chever. spark",
  "pickup_location": "",
  "billing_customer_name": "John",
  "billing_last_name": "Doe",
  "billing_address": "123 Main St",
  "billing_city": "Mumbai",
  "billing_pincode": "400001",
  "billing_state": "Maharashtra",
  "billing_country": "India",
  "billing_email": "john@example.com",
  "billing_phone": "9876543210",
  "shipping_is_billing": true,
  "shipping_customer_name": "John",
  "shipping_address": "123 Main St",
  "shipping_city": "Mumbai",
  "shipping_pincode": "400001",
  "shipping_state": "Maharashtra",
  "shipping_country": "India",
  "shipping_email": "john@example.com",
  "shipping_phone": "9876543210",
  "order_items": [
    {
      "name": "Engine Oil",
      "sku": "EO001",
      "units": 2,
      "selling_price": 500,
      "discount": 50,
      "tax": 45
    }
  ],
  "payment_method": "UPI",
  "sub_total": 1000,
  "length": 10,
  "breadth": 5,
  "height": 5,
  "weight": 1
}
```

#### Success Response (200)

```json
{
  "status": true,
  "message": "Orders created successfully",
  "order_id": "ORD_12345",
  "shiprocket_order_id": "123456"
}
```

#### Error Response (400/500)

```json
{
  "status": false,
  "error_type": "order",
  "message": "We cant place any order at this time."
}
```

---

### 2. Get User Orders

Get all orders for a specific user or a specific order

**Endpoint:** `POST /api/orders-user-list`  
**Authentication:** Not Required

#### Request Body

```json
{
  "user_id": "USR987654321",
  "order_id": "ORD_12345" // optional
}
```

#### Success Response (200) - Multiple Orders

Returns array of all orders for the user:

```json
{
  "status": true,
  "message": "Orders fetched successfully",
  "data": [
    {
      "order_id": "ORD_12345",
      "transaction_id": "TXN001",
      "vehicle_id": "VH001",
      "order_for": "vehicle: chevrolet spark",
      "order_date": "2025-07-20T12:15:00Z",
      "pickup_location": "Warehouse A",
      "billing_customer_name": "John",
      "billing_last_name": "Doe",
      "billing_address": "123 Main St",
      "billing_city": "Mumbai",
      "billing_pincode": "400001",
      "billing_state": "Maharashtra",
      "billing_country": "India",
      "billing_email": "john@example.com",
      "billing_phone": "9876543210",
      "shipping_is_billing": true,
      "shipping_customer_name": "John",
      "shipping_address": "123 Main St",
      "shipping_city": "Mumbai",
      "shipping_pincode": "400001",
      "shipping_state": "Maharashtra",
      "shipping_country": "India",
      "shipping_email": "john@example.com",
      "shipping_phone": "9876543210",
      "order_items": [
        {
          "name": "Product 1",
          "sku": "SKU001",
          "units": 2,
          "selling_price": 1000,
          "discount": 100,
          "tax": 90
        }
      ],
      "payment_method": "UPI",
      "sub_total": 1900,
      "length": 10,
      "breadth": 5,
      "height": 5,
      "weight": 1
    }
  ]
}
```

#### Success Response (200) - Single Order (when order_id is provided)

Returns array with single order:

```json
{
  "status": true,
  "message": "Orders fetched successfully",
  "data": [
    {
      "order_id": "ORD_12345"
      // ... full order details
    }
  ]
}
```

#### Error Response (404) - No Orders Found

```json
{
  "status": false,
  "error_type": "order",
  "message": "You have not placed any order yet"
}
```

#### Error Response (400) - Invalid User ID

```json
{
  "status": false,
  "error_type": "userId",
  "message": "Invalid user id"
}
```

#### Error Response (404) - Invalid Order ID

```json
{
  "status": false,
  "error_type": "order",
  "message": "Invalid order id"
}
```

#### Error Response (500)

```json
{
  "status": false,
  "error_type": "other",
  "message": "Server Issue."
}
```

---

### 3. Get Order Details

Get order details by order_id

**Endpoint:** `GET /api/orders/:order_id`  
**Authentication:** Not Required

#### Success Response (200)

```json
{
  "status": true,
  "message": "Order details retrieved successfully",
  "order": {...}
}
```

#### Error Response (404)

```json
{
  "status": false,
  "error_type": "order",
  "message": "Invalid order id"
}
```

---

### 4. Cancel Order

Cancel an existing order

**Endpoint:** `POST /api/orders/cancel`  
**Authentication:** Not Required

#### Request Body

```json
{
  "user_id": "USR987654321",
  "order_id": "ORD_12345",
  "reason": "Changed my mind" // optional
}
```

#### Success Response (200)

```json
{
  "status": true,
  "message": "Order cancelled successfully",
  "order_id": "ORD_12345"
}
```

#### Error Response (400/404/500)

```json
{
  "status": false,
  "error_type": "order",
  "message": "Cannot cancel a delivered order"
}
```

---

## 🔐 Environment Variables

Add these to your `.env` file for ShipRocket integration:

```env
SHIPROCKET_BASE_URL=https://apiv2.shiprocket.in/v1/external
SHIPROCKET_EMAIL=your-email@example.com
SHIPROCKET_PASSWORD=your-password
```

---

## 📋 Order Status

### Delivery Status

- `pending` - Order created, awaiting processing
- `processing` - Order is being processed
- `shipped` - Order has been shipped
- `out_for_delivery` - Order is out for delivery
- `delivered` - Order has been delivered
- `cancelled` - Order has been cancelled
- `returned` - Order has been returned

### ShipRocket Status

- `pending` - Pending sync with ShipRocket
- `processing` - Being processed in ShipRocket
- `confirmed` - Confirmed in ShipRocket
- `shipped` - Shipped via ShipRocket
- `delivered` - Delivered
- `cancelled` - Cancelled
- `failed` - Failed to sync with ShipRocket

---

## 🧠 Backend Impact

- **Order Creation:** Creates order in MongoDB and syncs with ShipRocket
- **Order Retrieval:** Fetches orders from MongoDB
- **Order Cancellation:** Updates order status in MongoDB
- **ShipRocket Integration:** Automatically creates shipment in ShipRocket
- **Database Storage:** Stores complete order details including ShipRocket response

---

## 🔍 Validation Rules

### Required Fields

- `user_id` - Must be a non-empty string
- `order_items` - Must be an array with at least one item
- Each order item must have: `name`, `sku`, `units`, `selling_price`

### Conditional Fields

- If `shipping_is_billing` is false, then shipping address fields are required:
  - `shipping_address`
  - `shipping_city`
  - `shipping_pincode`
  - `shipping_state`

### Field Validations

- `units` - Must be >= 1
- `selling_price` - Must be >= 0
- `discount` - Must be >= 0
- `tax` - Must be >= 0
- `sub_total` - Must be >= 0
- `length`, `breadth`, `height`, `weight` - Must be >= 0
- Email fields must be valid email format

---

## 📝 Notes

- Orders are automatically assigned a unique `order_id` in format: `ORD_XXXXX`
- Order date is automatically set to current server date
- ShipRocket token is cached for 23 hours for efficiency
- If ShipRocket sync fails, order is still saved in database with status `failed`
- Order cancellation is only allowed if order is not already delivered or cancelled
