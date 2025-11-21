const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    sender_id: {
      type: String,
      ref: "User",
      required: true,
      index: true,
    },
    receiver_id: {
      type: String,
      ref: "User",
      required: true,
      index: true,
    },
    sender_pic: {
      type: String,
      default: "",
    },
    sender_name: {
      type: String,
      required: true,
      trim: true,
    },
    notification_type: {
      type: String,
      enum: ["vehicle", "order", "doc_access", "chat", "other"],
      required: true,
      index: true,
    },
    notification_text: {
      type: String,
      required: true,
      trim: true,
    },
    notification_title: {
      type: String,
      default: "",
      trim: true,
    },
    issue_type: {
      type: String,
      default: "",
      trim: true,
    },
    link: {
      type: String,
      default: "",
    },
    vehicle_or_item_id: {
      type: String,
      default: "",
      index: true,
    },
    chat_data: {
      latitude: {
        type: String,
        default: "",
      },
      longitude: {
        type: String,
        default: "",
      },
      message: {
        type: String,
        default: "",
      },
      incident_proof_file: {
        type: String,
        default: "",
      },
    },
    chat_room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom",
      default: null,
    },
    chat_room_id: {
      type: String,
      default: "",
    },
    is_read: {
      type: Boolean,
      default: false,
      index: true,
    },
    is_sent: {
      type: Boolean,
      default: false,
      index: true,
    },
    sent_time: {
      type: Date,
      default: null,
    },
    one_signal_response: {
      type: Object,
      default: null,
    },
    notification_attempt: {
      type: Number,
      default: 1,
    },
    guest_id: {
      type: String,
      default: "",
      index: true,
    },
    is_guest_notification: {
      type: Boolean,
      default: false,
    },
    guest_expiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Indexes for better performance
notificationSchema.index({ receiver_id: 1, is_read: 1 });
notificationSchema.index({ receiver_id: 1, notification_type: 1 });
notificationSchema.index({ receiver_id: 1, createdAt: -1 });
notificationSchema.index({ guest_id: 1, guest_expiry: 1 });

// Static method to find notifications by receiver
notificationSchema.statics.findByReceiver = function (receiverId, options = {}) {
  const query = { receiver_id: receiverId };
  
  if (options.notification_type) {
    query.notification_type = options.notification_type;
  }
  
  if (options.is_read !== undefined) {
    query.is_read = options.is_read;
  }
  
  return this.find(query).sort({ createdAt: -1 });
};

// Static method to mark notifications as read
notificationSchema.statics.markAsRead = function (notificationIds, receiverId) {
  return this.updateMany(
    { _id: { $in: notificationIds }, receiver_id: receiverId },
    { is_read: true }
  );
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = function (receiverId) {
  return this.countDocuments({ receiver_id: receiverId, is_read: false });
};

// Static method to find guest notifications
notificationSchema.statics.findGuestNotifications = function (guestId) {
  return this.find({ guest_id: guestId, is_guest_notification: true });
};

// Static method to cleanup expired guest notifications
notificationSchema.statics.cleanupExpiredGuests = function () {
  return this.deleteMany({
    is_guest_notification: true,
    guest_expiry: { $lt: new Date() }
  });
};

// Instance method to mark as read
notificationSchema.methods.markAsRead = function () {
  this.is_read = true;
  return this.save();
};

// Instance method to mark as sent
notificationSchema.methods.markAsSent = function (oneSignalResponse) {
  this.is_sent = true;
  this.sent_time = new Date();
  this.one_signal_response = oneSignalResponse;
  return this.save();
};

module.exports = mongoose.model("Notification", notificationSchema);
