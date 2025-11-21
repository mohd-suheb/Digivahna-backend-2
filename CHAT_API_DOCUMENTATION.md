# 💬 Chat API Documentation

## 🌟 Overview

This document provides comprehensive documentation for the Real-Time Chat API built with Node.js, Express.js, MongoDB, and Socket.io.

---

## 🏗️ Architecture

```
Client (Mobile/Web App)
        ↓ (HTTP)
REST API (Node.js + Express.js)
        ↓ (MongoDB)
Database Storage (chats, messages)
        ↑ (WebSocket)
Real-time Events (Socket.io)
```

---

## 📊 Database Schema

### Collections

#### 1. **Chats** (`chats` collection)

```json
{
  "_id": "ObjectId",
  "participants": ["user123", "user456"],
  "lastMessage": {
    "text": "Hello ❤️",
    "timestamp": "2025-08-13T12:30:00Z"
  },
  "created_at": "2025-08-13T12:00:00Z",
  "updated_at": "2025-08-13T12:30:00Z"
}
```

#### 2. **Messages** (`messages` collection)

```json
{
  "_id": "ObjectId",
  "chatId": "ObjectId",
  "senderId": "user123",
  "receiverId": "user456",
  "message": "Hello ❤️",
  "attachments": [],
  "status": "sent",
  "timestamp": "2025-08-13T12:30:00Z"
}
```

---

## 🌐 REST API Endpoints

### 1. Create or Get Chat

**Endpoint:** `POST /api/chats`

**Description:** Create a new chat or retrieve existing chat between two users.

**Request Body:**

```json
{
  "user1": "user123",
  "user2": "user456"
}
```

**Response (Success):**

```json
{
  "status": true,
  "message": "Chat created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "participants": ["user123", "user456"],
    "lastMessage": {
      "text": "",
      "timestamp": "2025-08-13T12:00:00Z"
    },
    "created_at": "2025-08-13T12:00:00Z",
    "updated_at": "2025-08-13T12:00:00Z"
  }
}
```

---

### 2. Get User Chats

**Endpoint:** `GET /api/chats/:userId`

**Description:** Get all chats for a specific user with pagination.

**Query Parameters:**

- `limit` (optional): Number of chats per page (default: 50)
- `page` (optional): Page number (default: 1)

**Response (Success):**

```json
{
  "status": true,
  "message": "Chats retrieved successfully",
  "data": {
    "chats": [...],
    "totalCount": 25,
    "currentPage": 1,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

---

### 3. Get Chat Details

**Endpoint:** `GET /api/chats/details/:chatId`

**Description:** Get details of a specific chat.

**Response (Success):**

```json
{
  "status": true,
  "message": "Chat retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "participants": ["user123", "user456"],
    "lastMessage": {
      "text": "Hello ❤️",
      "timestamp": "2025-08-13T12:30:00Z"
    },
    "created_at": "2025-08-13T12:00:00Z",
    "updated_at": "2025-08-13T12:30:00Z"
  }
}
```

---

### 4. Send Message

**Endpoint:** `POST /api/messages`

**Description:** Send a new message in a chat.

**Request Body:**

```json
{
  "chatId": "507f1f77bcf86cd799439011",
  "senderId": "user123",
  "receiverId": "user456",
  "message": "Hello ❤️",
  "attachments": []
}
```

**Response (Success):**

```json
{
  "status": true,
  "message": "Message sent successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "chatId": "507f1f77bcf86cd799439011",
    "senderId": "user123",
    "receiverId": "user456",
    "message": "Hello ❤️",
    "attachments": [],
    "status": "sent",
    "timestamp": "2025-08-13T12:30:00Z"
  }
}
```

---

### 5. Get Messages

**Endpoint:** `GET /api/messages/:chatId`

**Description:** Get all messages for a specific chat with pagination.

**Query Parameters:**

- `limit` (optional): Number of messages per page (default: 50)
- `offset` (optional): Number of messages to skip (default: 0)

**Response (Success):**

```json
{
  "status": true,
  "message": "Messages retrieved successfully",
  "data": {
    "messages": [...],
    "totalCount": 150,
    "currentPage": 1,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### 6. Update Message Status

**Endpoint:** `PATCH /api/messages/:messageId/status`

**Description:** Update the status of a message (sent, delivered, seen).

**Request Body:**

```json
{
  "status": "seen"
}
```

**Response (Success):**

```json
{
  "status": true,
  "message": "Message status updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "chatId": "507f1f77bcf86cd799439011",
    "senderId": "user123",
    "receiverId": "user456",
    "message": "Hello ❤️",
    "attachments": [],
    "status": "seen",
    "timestamp": "2025-08-13T12:30:00Z"
  }
}
```

---

### 7. Get Unread Count

**Endpoint:** `GET /api/messages/unread/:userId`

**Description:** Get the count of unread messages for a user.

**Query Parameters:**

- `chatId` (optional): Filter by specific chat

**Response (Success):**

```json
{
  "status": true,
  "message": "Unread count retrieved successfully",
  "data": {
    "unreadCount": 5
  }
}
```

---

## 🔌 Socket.IO Events

### Client Events (Client → Server)

#### 1. **Connection**

```javascript
// Connect to server
socket = io("http://localhost:3000", {
  auth: {
    token: "your-jwt-token",
    userId: "user123",
  },
});
```

#### 2. **Join Room**

```javascript
socket.emit("joinRoom", { chatId: "chat123" });
```

#### 3. **Leave Room**

```javascript
socket.emit("leaveRoom", { chatId: "chat123" });
```

#### 4. **Send Message**

```javascript
socket.emit("sendMessage", {
  chatId: "chat123",
  senderId: "user123",
  receiverId: "user456",
  message: "Hello ❤️",
  attachments: [],
});
```

#### 5. **Mark as Delivered**

```javascript
socket.emit("messageDelivered", {
  chatId: "chat123",
  messageId: "msg123",
});
```

#### 6. **Mark as Seen**

```javascript
socket.emit("messageSeen", { chatId: "chat123" });
```

#### 7. **Typing Indicator**

```javascript
socket.emit("typing", {
  chatId: "chat123",
  isTyping: true,
});
```

#### 8. **User Online**

```javascript
socket.emit("userOnline");
```

#### 9. **User Offline**

```javascript
socket.emit("userOffline");
```

---

### Server Events (Server → Client)

#### 1. **Receive Message**

```javascript
socket.on("receiveMessage", (message) => {
  console.log("New message:", message);
});
```

#### 2. **Message Sent Confirmation**

```javascript
socket.on("messageSent", (data) => {
  console.log("Message sent:", data);
});
```

#### 3. **Status Updated**

```javascript
socket.on("statusUpdated", (data) => {
  console.log("Status updated:", data);
});
```

#### 4. **Messages Seen**

```javascript
socket.on("messagesSeen", (data) => {
  console.log("Messages seen:", data);
});
```

#### 5. **User Typing**

```javascript
socket.on("userTyping", (data) => {
  console.log("User typing:", data);
});
```

#### 6. **User Status Update**

```javascript
socket.on("userStatusUpdate", (data) => {
  console.log("User status:", data);
});
```

#### 7. **Error**

```javascript
socket.on("error", (error) => {
  console.error("Socket error:", error);
});
```

---

## 🔐 Authentication

### REST API Authentication

All REST API endpoints should include a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Socket.IO Authentication

When connecting to Socket.IO, provide authentication in the connection options:

```javascript
const socket = io("http://localhost:3000", {
  auth: {
    token: "your-jwt-token",
    userId: "user123",
  },
});
```

---

## 📋 Message Status Flow

1. **Sent** - Message is sent but not yet delivered
2. **Delivered** - Message reached the recipient
3. **Seen** - Message has been read by the recipient

---

## 🎯 Features

✅ One-to-One Chat  
✅ Fetch previous messages with pagination  
✅ Real-time messaging using Socket.IO  
✅ Message status (sent, delivered, seen)  
✅ Attachments support (image URLs)  
✅ User online/offline status  
✅ Typing indicators  
✅ Unread message count  
✅ Last message tracking

---

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install socket.io
```

### 2. Environment Variables

No additional environment variables required! The Chat API uses your existing MongoDB connection.

### 3. Run the Server

```bash
npm run dev
```

The server will start on port 3000 with Socket.IO enabled.

---

## 📝 Example Client Implementation

### JavaScript/React Client

```javascript
import io from "socket.io-client";

// Connect to server
const socket = io("http://localhost:3000", {
  auth: {
    userId: "user123",
  },
});

// Listen for messages
socket.on("receiveMessage", (message) => {
  console.log("New message:", message);
});

// Send a message
socket.emit("sendMessage", {
  chatId: "chat123",
  senderId: "user123",
  receiverId: "user456",
  message: "Hello!",
});
```

---

## ⚠️ Error Responses

### Invalid Parameter

```json
{
  "status": false,
  "error_type": "Invalid parameter",
  "message": "You have entered invalid parameter"
}
```

### Chat Not Found

```json
{
  "status": false,
  "error_type": "Chat not found",
  "message": "Chat not found"
}
```

### Message Not Found

```json
{
  "status": false,
  "error_type": "Message not found",
  "message": "Message not found"
}
```

### Server Error

```json
{
  "status": false,
  "error_type": "other",
  "message": "Server Issue."
}
```

---

## 🧪 Testing

### Using Postman

1. Import the Postman collection
2. Set up environment variables
3. Test each endpoint

### Using cURL

```bash
# Create/Get Chat
curl -X POST http://localhost:3000/api/chats \
  -H "Content-Type: application/json" \
  -d '{"user1":"user123","user2":"user456"}'

# Get User Chats
curl http://localhost:3000/api/chats/user123

# Send Message
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{
    "chatId":"chat123",
    "senderId":"user123",
    "receiverId":"user456",
    "message":"Hello!"
  }'
```

---

## 📊 Database Indexes

The following indexes are created for optimal performance:

- `participants` - For finding user chats
- `lastMessage.timestamp` - For sorting chats by recent activity
- `updated_at` - For general sorting
- `chatId, timestamp` - For retrieving messages in a chat
- `senderId, receiverId` - For user-to-user messages
- `status` - For filtering by message status

---

## 🎉 Ready to Use!

The Chat API is now fully implemented and ready for use:

- ✅ REST API endpoints for chat management
- ✅ Socket.IO for real-time messaging
- ✅ Message status tracking
- ✅ Typing indicators
- ✅ User online/offline status
- ✅ Pagination for messages and chats
- ✅ Database optimization with indexes

**Happy Chatting! 💬**
