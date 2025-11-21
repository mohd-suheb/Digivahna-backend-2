# 🔧 Environment Variables for Recently Built APIs

## 📋 Overview

This document lists all environment variables required for the recently built Order Management and Review Management APIs.

---

## ✅ Review Management APIs

**No external environment variables required!**

The Review APIs (`POST /api/review-submit` and `POST /api/user-feedback`) are fully self-contained and only require:

- ✅ MongoDB connection (already configured)
- ✅ No external API integrations
- ✅ No additional environment variables needed

---

## 🔑 Order Management APIs

### Required Environment Variables

The Order Management API requires ShipRocket integration environment variables:

#### 1. **ShipRocket Authentication**

```
SHIPROCKET_BASE_URL=https://apiv2.shiprocket.in/v1/external
SHIPROCKET_EMAIL=your-shiprocket-email@example.com
SHIPROCKET_PASSWORD=your-shiprocket-password
```

**Where it's used:**

- `POST /api/orders` - When creating a new order, the system attempts to sync with ShipRocket
- ShipRocket is used for order fulfillment and shipping management

**What it does:**

- Authenticates with ShipRocket API
- Creates orders in ShipRocket system
- Tracks shipments and delivery status

**Note:** If ShipRocket integration fails, the order is still saved in your local database with a "failed" status, so the API continues to work without ShipRocket credentials.

---

## 📝 Complete Environment Variables List

### Order Management APIs

| Variable              | Required                 | Default                                   | Description                 |
| --------------------- | ------------------------ | ----------------------------------------- | --------------------------- |
| `SHIPROCKET_BASE_URL` | No                       | `https://apiv2.shiprocket.in/v1/external` | ShipRocket API base URL     |
| `SHIPROCKET_EMAIL`    | **Yes** (for ShipRocket) | None                                      | ShipRocket account email    |
| `SHIPROCKET_PASSWORD` | **Yes** (for ShipRocket) | None                                      | ShipRocket account password |

### Review Management APIs

| Variable | Required | Default | Description                     |
| -------- | -------- | ------- | ------------------------------- |
| None     | -        | -       | No environment variables needed |

---

## 🚀 Setup Instructions

### For Order Management APIs

1. **Add to your `.env` file:**

```env
# ShipRocket Configuration (Optional - Order API will work without it)
SHIPROCKET_BASE_URL=https://apiv2.shiprocket.in/v1/external
SHIPROCKET_EMAIL=your-email@s domain.com
SHIPROCKET_PASSWORD=your-secure-password
```

2. **Where to get credentials:**

   - Sign up at [ShipRocket](https://www.shiprocket.in/)
   - Navigate to Settings → API
   - Generate API credentials
   - Copy email and password

3. **Note:** Order API will work without ShipRocket credentials, but orders won't sync with the shipping service.

### For Review Management APIs

No setup required! These APIs use your existing MongoDB connection.

---

## 🎯 Environment Variable Configuration

### Current Environment Variables in the Project

Based on the codebase, here are all environment variables used:

#### **Database Connection** (Existing)

```env
MONGODB_URI=your-mongodb-connection-string
```

#### **AWS SES** (Existing - for emails)

```env
SES_SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SES_SMTP_PORT=587
SES_SMTP_USER=your-ses-access-key
SES_SMTP_PASS=your-ses-secret-key
```

#### **OneSignal** (Existing - for push notifications)

```env
ONE_SIGNAL_APP_ID=your-onesignal-app-id
ONE_SIGNAL_API_KEY=your-onesignal-api-key
```

#### **Razorpay** (Existing - for payments)

```env
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

#### **RTO API** (Existing - for vehicle data)

```env
RTO_API_URL=your-rto-api-url
RTO_API_ACCESS_TOKEN=your-rto-api-token
```

#### **ShipRocket** (NEW - for Order Management)

```env
SHIPROCKET_BASE_URL=https://apiv2.shiprocket.in/v1/external
SHIPROCKET_EMAIL=your-email@domain.com
SHIPROCKET_PASSWORD=your-password
```

---

## ✅ Summary

### Review APIs (Submit Review, Get User Feedback)

- ❌ **No environment variables needed**
- ✅ Works immediately with existing MongoDB setup

### Order APIs (Create Order, Get Orders, Cancel Order)

- ⚠️ **Optional**: ShipRocket credentials for shipping integration
- ✅ **Works without** ShipRocket (orders saved locally only)

---

## 🔒 Security Notes

1. **Never commit `.env` file to version control**
2. **Use strong passwords** for ShipRocket
3. **Rotate credentials** periodically
4. **Keep credentials secure** and limit access

---

## 📞 Support

If you need help setting up environment variables:

1. Review the documentation in `ORDER_API_DOCUMENTATION.md`
2. Check ShipRocket API documentation
3. Ensure MongoDB is running and accessible
