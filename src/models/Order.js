const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  sku: {
    type: String,
    required: true,
    trim: true,
  },
  units: {
    type: Number,
    required: true,
    min: 1,
  },
  selling_price: {
    type: Number,
    required: true,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
  },
  tax: {
    type: Number,
    default: 0,
    min: 0,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    order_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    transaction_id: {
      type: String,
      default: "",
      trim: true,
    },
    vehicle_id: {
      type: String,
      default: "",
      trim: true,
    },
    order_for: {
      type: String,
      default: "",
      trim: true,
    },
    order_date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    pickup_location: {
      type: String,
      default: "",
      trim: true,
    },
    billing_customer_name: {
      type: String,
      default: "",
      trim: true,
    },
    billing_last_name: {
      type: String,
      default: "",
      trim: true,
    },
    billing_address: {
      type: String,
      default: "",
      trim: true,
    },
    billing_city: {
      type: String,
      default: "",
      trim: true,
    },
    billing_pincode: {
      type: String,
      default: "",
      trim: true,
    },
    billing_state: {
      type: String,
      default: "",
      trim: true,
    },
    billing_country: {
      type: String,
      default: "India",
      trim: true,
    },
    billing_email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    billing_phone: {
      type: String,
      default: "",
      trim: true,
    },
    shipping_is_billing: {
      type: Boolean,
      default: false,
    },
    shipping_customer_name: {
      type: String,
      default: "",
      trim: true,
    },
    shipping_last_name: {
      type: String,
      default: "",
      trim: true,
    },
    shipping_address: {
      type: String,
      default: "",
      trim: true,
    },
    shipping_city: {
      type: String,
      default: "",
      trim: true,
    },
    shipping_pincode: {
      type: String,
      default: "",
      trim: true,
    },
    shipping_state: {
      type: String,
      default: "",
      trim: true,
    },
    shipping_country: {
      type: String,
      default: "India",
      trim: true,
    },
    shipping_email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    shipping_phone: {
      type: String,
      default: "",
      trim: true,
    },
    order_items: [orderItemSchema],
    payment_method: {
      type: String,
      default: "",
      trim: true,
    },
    sub_total: {
      type: Number,
      default: 0,
      min: 0,
    },
    length: {
      type: Number,
      default: 0,
      min: 0,
    },
    breadth: {
      type: Number,
      default: 0,
      min: 0,
    },
    height: {
      type: Number,
      default: 0,
      min: 0,
    },
    weight: {
      type: Number,
      default: 0,
      min: 0,
    },
    // ShipRocket specific fields
    shiprocket_order_id: {
      type: String,
      default: "",
      trim: true,
    },
    shiprocket_shipment_id: {
      type: String,
      default: "",
      trim: true,
    },
    shiprocket_awb: {
      type: String,
      default: "",
      trim: true,
    },
    shiprocket_status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
        "failed",
      ],
      default: "pending",
      index: true,
    },
    shiprocket_response: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    delivery_status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "pending",
      index: true,
    },
    cancellation_reason: {
      type: String,
      default: "",
    },
    created_at: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for better query performance
orderSchema.index({ user_id: 1, order_date: -1 });
orderSchema.index({ order_id: 1 });
orderSchema.index({ shiprocket_order_id: 1 });
orderSchema.index({ vehicle_id: 1 });
orderSchema.index({ delivery_status: 1 });

// Pre-save middleware to update updated_at timestamp
orderSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

// Static method to generate unique order_id
orderSchema.statics.generateOrderId = async function () {
  let orderId;
  let isUnique = false;

  while (!isUnique) {
    // Generate order_id in format: ORD_XXXXX
    const randomNum = Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, "0");
    orderId = `ORD_${randomNum}`;

    // Check if order_id already exists
    const existingOrder = await this.findOne({ order_id: orderId });
    if (!existingOrder) {
      isUnique = true;
    }
  }

  return orderId;
};

// Static method to get orders by user_id
orderSchema.statics.getUserOrders = async function (userId, options = {}) {
  try {
    const { limit = 50, skip = 0, status = null } = options;

    // Build query
    const query = { user_id: userId };

    if (status) {
      query.delivery_status = status;
    }

    // Get orders with pagination
    const orders = await this.find(query)
      .sort({ order_date: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    // Get total count for pagination info
    const totalCount = await this.countDocuments(query);

    return {
      orders: orders,
      totalCount: totalCount,
      currentPage: Math.floor(skip / limit) + 1,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage: skip + limit < totalCount,
      hasPrevPage: skip > 0,
    };
  } catch (error) {
    throw error;
  }
};

// Static method to get order by order_id
orderSchema.statics.getOrderById = async function (orderId) {
  try {
    const order = await this.findOne({ order_id: orderId });
    return order;
  } catch (error) {
    throw error;
  }
};

// Static method to get order by user_id and order_id
orderSchema.statics.getUserOrderById = async function (userId, orderId) {
  try {
    const order = await this.findOne({ user_id: userId, order_id: orderId });
    return order;
  } catch (error) {
    throw error;
  }
};

// Method to update order status
orderSchema.methods.updateStatus = async function (
  status,
  additionalData = {}
) {
  this.delivery_status = status;
  this.updated_at = Date.now();

  // Update additional fields if provided
  Object.keys(additionalData).forEach((key) => {
    if (this.schema.paths[key]) {
      this[key] = additionalData[key];
    }
  });

  return await this.save();
};

// Method to cancel order
orderSchema.methods.cancelOrder = async function (reason) {
  this.delivery_status = "cancelled";
  this.shiprocket_status = "cancelled";
  this.cancellation_reason = reason;
  this.updated_at = Date.now();
  return await this.save();
};

module.exports = mongoose.model("Order", orderSchema);
