const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
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
      index: true,
      trim: true,
    },
    product_type: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    review_type: {
      type: String,
      enum: ["app", "qr", "order_service", "service_history", "all", "other"],
      default: "other",
      index: true,
    },
    user_name: {
      type: String,
      default: "",
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      validate: {
        validator: function (v) {
          // Allow ratings from 0 to 5 with 0.5 increments (0, 0.5, 1, 1.5, etc.)
          return v >= 0 && v <= 5;
        },
        message: "Rating must be between 0 and 5",
      },
    },
    review_title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    review_text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    user_review_message: {
      type: String,
      default: "",
      trim: true,
    },
    user_rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    media_files: [
      {
        type: String,
        trim: true,
        validate: {
          validator: function (v) {
            // Basic URL validation
            return !v || /^https?:\/\/.+/.test(v);
          },
          message: "Media file must be a valid URL",
        },
      },
    ],
    helpful_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    verified_purchase: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "hidden"],
      default: "pending",
      index: true,
    },
    admin_remarks: {
      type: String,
      default: "",
      trim: true,
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
reviewSchema.index(
  { user_id: 1, order_id: 1, product_type: 1 },
  { unique: true }
);
reviewSchema.index({ product_type: 1, status: 1 });
reviewSchema.index({ review_type: 1, status: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ created_at: -1 });
reviewSchema.index({ date: -1 });

// Pre-save middleware to update updated_at timestamp
reviewSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

// Static method to check if review already exists
reviewSchema.statics.checkExistingReview = async function (
  userId,
  orderId,
  productType
) {
  try {
    const existingReview = await this.findOne({
      user_id: userId,
      order_id: orderId,
      product_type: productType,
    });
    return existingReview;
  } catch (error) {
    throw error;
  }
};

// Static method to get reviews by product
reviewSchema.statics.getReviewsByProduct = async function (
  productType,
  options = {}
) {
  try {
    const {
      limit = 50,
      skip = 0,
      status = "approved",
      rating = null,
    } = options;

    const query = { product_type: productType, status: status };

    if (rating !== null) {
      query.rating = rating;
    }

    const reviews = await this.find(query)
      .sort({ created_at: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const totalCount = await this.countDocuments(query);

    return {
      reviews: reviews,
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

// Static method to get user reviews
reviewSchema.statics.getUserReviews = async function (userId, options = {}) {
  try {
    const { limit = 50, skip = 0 } = options;

    const reviews = await this.find({ user_id: userId })
      .sort({ created_at: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const totalCount = await this.countDocuments({ user_id: userId });

    return {
      reviews: reviews,
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

// Static method to get reviews by review_type with pagination
reviewSchema.statics.getReviewsByType = async function (
  reviewType,
  options = {}
) {
  try {
    const { limit = 50, page = 1 } = options;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build query
    const query = {};

    if (reviewType && reviewType !== "all") {
      query.review_type = reviewType;
    }

    // Get reviews with pagination
    const reviews = await this.find(query)
      .sort({ date: -1, created_at: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count for pagination info
    const totalCount = await this.countDocuments(query);

    return {
      reviews: reviews,
      totalCount: totalCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / limit),
      limit: parseInt(limit),
    };
  } catch (error) {
    throw error;
  }
};

// Static method to calculate average rating for a product
reviewSchema.statics.getAverageRating = async function (productType) {
  try {
    const result = await this.aggregate([
      { $match: { product_type: productType, status: "approved" } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          ratingCounts: {
            $push: "$rating",
          },
        },
      },
    ]);

    if (result.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
      };
    }

    const ratingCounts = result[0].ratingCounts;
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    ratingCounts.forEach((rating) => {
      const roundedRating = Math.round(rating);
      if (roundedRating >= 1 && roundedRating <= 5) {
        distribution[roundedRating]++;
      }
    });

    return {
      averageRating: result[0].averageRating,
      totalReviews: result[0].totalReviews,
      ratingDistribution: distribution,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model("Review", reviewSchema);
