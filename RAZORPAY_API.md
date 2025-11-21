# Razorpay API Documentation

## Overview
The Razorpay API provides comprehensive payment integration functionality for the DigiVahan backend. It handles order creation, payment verification, refunds, and payment management using Razorpay's payment gateway services. The API supports multiple currencies and provides secure payment processing with proper validation and error handling.

## Features
- 🌟 **Order Creation**: Create Razorpay orders with customizable parameters
- ✨ **Payment Verification**: Verify payment signatures for security
- 🔄 **Payment Management**: Get payment and order details
- 🛡️ **Refund Processing**: Process full and partial refunds
- 📊 **Key Management**: Retrieve Razorpay keys for frontend integration
- 🔐 **Security**: Secure payment processing with signature verification

## API Endpoints

### 1. Create Order
**Endpoint**: `POST /razorpay/create-order`  
**Authentication**: No authentication required (as per requirements)  
**Description**: Create a new Razorpay order for payment processing

#### Request Parameters

**Required Parameters:**
- `amount` (string): The amount of the order in paise (e.g., "300" for ₹3.00)

**Optional Parameters:**
- `currency` (string): Currency code (default: "INR")
- `receipt` (string): Receipt identifier for the order
- `notes` (object): Additional notes for the order

#### Request Example
```json
{
  "amount": "300",
  "currency": "INR",
  "receipt": "order_rcptid_7868",
  "notes": {
    "description": "DigiVahan Service Payment",
    "user_id": "user123"
  }
}
```

#### Response Example
```json
{
  "orders": {
    "amount": "300",
    "created_at": 1758720591,
    "currency": "INR",
    "entity": "order",
    "id": "order_RLSJV0Z7tzLVAM",
    "notes": {
      "description": "DigiVahan Service Payment",
      "user_id": "user123"
    },
    "offer_id": null,
    "receipt": "order_rcptid_7868",
    "status": "created"
  },
  "status": true
}
```

**Error - Invalid Parameter**
```json
{
  "status": false,
  "error_type": "other",
  "message": "You have entered invalid parameter"
}
```

**Error - Server Issue**
```json
{
  "status": false,
  "error_type": "other",
  "message": "Server Issue."
}
```

### 2. Verify Payment
**Endpoint**: `POST /razorpay/verify-payment`  
**Authentication**: No authentication required  
**Description**: Verify payment signature for security

#### Request Parameters
- `order_id` (string): The order ID from Razorpay
- `payment_id` (string): The payment ID from Razorpay
- `signature` (string): The payment signature for verification

#### Request Example
```json
{
  "order_id": "order_RLSJV0Z7tzLVAM",
  "payment_id": "pay_RLSJV0Z7tzLVAM",
  "signature": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0"
}
```

#### Response
```json
{
  "status": true,
  "message": "Payment verified successfully",
  "data": {
    "payment_id": "pay_RLSJV0Z7tzLVAM",
    "order_id": "order_RLSJV0Z7tzLVAM",
    "amount": 300,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "created_at": 1758720591,
    "captured": true
  }
}
```

### 3. Get Payment Details
**Endpoint**: `GET /razorpay/payment/:payment_id`  
**Authentication**: No authentication required  
**Description**: Get detailed information about a specific payment

#### Response
```json
{
  "status": true,
  "message": "Payment details retrieved successfully",
  "data": {
    "payment_id": "pay_RLSJV0Z7tzLVAM",
    "order_id": "order_RLSJV0Z7tzLVAM",
    "amount": 300,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "created_at": 1758720591,
    "captured": true,
    "description": "DigiVahan Service Payment",
    "notes": {
      "user_id": "user123"
    }
  }
}
```

### 4. Get Order Details
**Endpoint**: `GET /razorpay/order/:order_id`  
**Authentication**: No authentication required  
**Description**: Get detailed information about a specific order

#### Response
```json
{
  "status": true,
  "message": "Order details retrieved successfully",
  "data": {
    "order_id": "order_RLSJV0Z7tzLVAM",
    "amount": 300,
    "currency": "INR",
    "status": "paid",
    "receipt": "order_rcptid_7868",
    "created_at": 1758720591,
    "notes": {
      "description": "DigiVahan Service Payment",
      "user_id": "user123"
    },
    "offer_id": null
  }
}
```

### 5. Get Razorpay Keys
**Endpoint**: `GET /razorpay/keys`  
**Authentication**: No authentication required  
**Description**: Get Razorpay keys for frontend integration

#### Response
```json
{
  "status": true,
  "message": "Razorpay keys retrieved successfully",
  "data": {
    "key_id": "rzp_test_RYVCGyR1rAa2r1",
    "currency": "INR",
    "name": "DigiVahan",
    "description": "DigiVahan Payment Gateway"
  }
}
```

### 6. Create Refund
**Endpoint**: `POST /razorpay/refund`  
**Authentication**: No authentication required  
**Description**: Create a refund for a payment

#### Request Parameters
- `payment_id` (string): The payment ID to refund
- `amount` (optional): Amount to refund (if not provided, full refund)
- `notes` (optional): Refund notes

#### Request Example
```json
{
  "payment_id": "pay_RLSJV0Z7tzLVAM",
  "amount": "150",
  "notes": {
    "reason": "Partial refund for service cancellation"
  }
}
```

#### Response
```json
{
  "status": true,
  "message": "Payment refunded successfully",
  "data": {
    "refund_id": "rfnd_RLSJV0Z7tzLVAM",
    "payment_id": "pay_RLSJV0Z7tzLVAM",
    "amount": 150,
    "currency": "INR",
    "status": "processed",
    "created_at": 1758720591,
    "notes": {
      "reason": "Partial refund for service cancellation"
    }
  }
}
```

## Business Logic

### Order Creation Flow
1. **Validation**: Validate amount and other parameters
2. **Amount Conversion**: Convert amount to paise (multiply by 100)
3. **Receipt Generation**: Generate receipt ID if not provided
4. **Order Creation**: Create order with Razorpay API
5. **Response Formatting**: Format response with order details
6. **Error Handling**: Handle Razorpay API errors

### Payment Verification Flow
1. **Parameter Validation**: Validate order_id, payment_id, and signature
2. **Signature Generation**: Generate expected signature using HMAC SHA256
3. **Signature Verification**: Compare expected and provided signatures
4. **Payment Fetch**: Get payment details from Razorpay
5. **Response Formatting**: Format response with payment details

### Refund Processing Flow
1. **Parameter Validation**: Validate payment_id and amount
2. **Refund Creation**: Create refund with Razorpay API
3. **Response Formatting**: Format response with refund details
4. **Error Handling**: Handle Razorpay API errors

## Configuration

### Environment Variables
```bash
RAZORPAY_KEY_ID=rzp_test_RYVCGyR1rAa2r1
RAZORPAY_KEY_SECRET=N0TzC1FQwi9CqS7MSbDdLWCp
```

### Razorpay Instance Configuration
```javascript
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_RYVCGyR1rAa2r1",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "N0TzC1FQwi9CqS7MSbDdLWCp",
});
```

## Error Handling

### Validation Errors
- Missing required fields
- Invalid amount format
- Invalid currency code
- Invalid parameter types

### Razorpay API Errors
- Order creation failures
- Payment verification failures
- Refund processing failures
- Invalid order/payment IDs

### Server Errors
- Database connection issues
- Internal processing errors
- Razorpay service unavailability

## Testing

### Test Cases
1. **Valid Order Creation**: Test with valid amount and parameters
2. **Invalid Amount**: Test with invalid amount values
3. **Payment Verification**: Test with valid payment signature
4. **Invalid Signature**: Test with invalid payment signature
5. **Payment Details**: Test payment details retrieval
6. **Order Details**: Test order details retrieval
7. **Refund Processing**: Test full and partial refunds
8. **Error Handling**: Test various error scenarios

### Sample Test Data
```json
{
  "amount": "300",
  "currency": "INR",
  "receipt": "test_receipt_123",
  "notes": {
    "test": true,
    "user_id": "test_user"
  }
}
```

## Integration Notes

### Frontend Integration
- Use Razorpay keys for frontend integration
- Implement proper error handling
- Handle payment callbacks
- Display payment status

### Security Considerations
- Always verify payment signatures
- Use HTTPS for all requests
- Store sensitive data securely
- Implement proper logging

### Performance Considerations
- Cache Razorpay keys
- Implement retry logic
- Monitor API response times
- Handle rate limiting

## Future Enhancements

1. **Webhook Support**: Implement Razorpay webhooks
2. **Payment Methods**: Support multiple payment methods
3. **Subscription**: Implement subscription payments
4. **Analytics**: Payment analytics and reporting
5. **Multi-currency**: Enhanced multi-currency support
6. **Fraud Detection**: Implement fraud detection
7. **Payment Links**: Generate payment links
8. **Settlement**: Automated settlement processing

## Security Considerations

### Payment Security
- Always verify payment signatures
- Use secure communication (HTTPS)
- Implement proper validation
- Monitor for suspicious activity

### Data Protection
- Encrypt sensitive data
- Implement proper logging
- Follow PCI DSS guidelines
- Regular security audits

### API Security
- Rate limiting
- Input validation
- Error handling
- Authentication (if needed)

## Monitoring and Logging

### Key Metrics
- Order creation success rate
- Payment verification success rate
- Refund processing rate
- API response times

### Log Messages
- Order creation attempts
- Payment verification attempts
- Refund processing
- Error conditions
- Security events

### Security Monitoring
- Track payment patterns
- Monitor for fraud
- Alert on suspicious activity
- Log security events
