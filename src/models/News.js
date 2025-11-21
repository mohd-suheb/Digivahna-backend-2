const mongoose = require("mongoose");

// News Schema
const newsSchema = new mongoose.Schema(
  {
    news_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    banner: {
      type: String,
      required: true,
      trim: true,
    },
    news_type: {
      type: String,
      required: true,
      enum: [
        "automotive",
        "technology",
        "safety",
        "environment",
        "business",
        "government",
        "general",
        "breaking",
        "featured"
      ],
      trim: true,
    },
    heading: {
      type: String,
      required: true,
      trim: true,
    },
    sub_description: {
      type: String,
      required: false,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    news: {
      type: String,
      required: true,
    },
    posting_date: {
      type: Date,
      default: Date.now,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Pre-save middleware to update updated_at timestamp
newsSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

// Static method to generate unique news_id
newsSchema.statics.generateNewsId = async function () {
  let newsId;
  let isUnique = false;
  
  while (!isUnique) {
    // Generate news_id in format: news_XXXXX
    const randomNum = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    newsId = `news_${randomNum}`;
    
    // Check if news_id already exists
    const existingNews = await this.findOne({ news_id: newsId });
    if (!existingNews) {
      isUnique = true;
    }
  }
  
  return newsId;
};

// Static method to add new news
newsSchema.statics.addNews = async function (newsData) {
  try {
    // Generate unique news_id
    const newsId = await this.generateNewsId();
    
    // Create new news document
    const newNews = new this({
      news_id: newsId,
      ...newsData,
      posting_date: new Date(), // Set posting date to current timestamp
    });
    
    // Save to database
    const savedNews = await newNews.save();
    return savedNews;
  } catch (error) {
    throw error;
  }
};

// Static method to get all news
newsSchema.statics.getAllNews = async function (limit = 50, skip = 0) {
  try {
    const news = await this.find({ status: "published" })
      .sort({ posting_date: -1 })
      .limit(limit)
      .skip(skip);
    return news;
  } catch (error) {
    throw error;
  }
};

// Static method to get news list with pagination for user API
newsSchema.statics.getNewsList = async function (limit = 10, skip = 0, news_type = null) {
  try {
    // Build query filter
    const filter = { status: "published" };
    if (news_type && news_type.trim() !== "") {
      filter.news_type = news_type;
    }

    // Get news with pagination
    const news = await this.find(filter)
      .select('news_id banner posting_date news_type heading sub_description description')
      .sort({ posting_date: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    // Get total count for pagination info
    const totalCount = await this.countDocuments(filter);

    return {
      news: news,
      totalCount: totalCount,
      currentPage: Math.floor(skip / limit) + 1,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage: skip + limit < totalCount,
      hasPrevPage: skip > 0
    };
  } catch (error) {
    throw error;
  }
};

// Static method to get news by news_id
newsSchema.statics.getNewsById = async function (newsId) {
  try {
    const news = await this.findOne({ news_id: newsId });
    return news;
  } catch (error) {
    throw error;
  }
};

// Static method to get news by type
newsSchema.statics.getNewsByType = async function (newsType, limit = 20) {
  try {
    const news = await this.find({ 
      news_type: newsType, 
      status: "published" 
    })
      .sort({ posting_date: -1 })
      .limit(limit);
    return news;
  } catch (error) {
    throw error;
  }
};

// Static method to update news
newsSchema.statics.updateNews = async function (newsId, newsData) {
  try {
    const updatedNews = await this.findOneAndUpdate(
      { news_id: newsId },
      { 
        ...newsData,
        updated_at: new Date()
      },
      { new: true, runValidators: true }
    );
    return updatedNews;
  } catch (error) {
    throw error;
  }
};

// Static method to delete news
newsSchema.statics.deleteNews = async function (newsId) {
  try {
    const deletedNews = await this.findOneAndDelete({ news_id: newsId });
    return deletedNews;
  } catch (error) {
    throw error;
  }
};

// Static method to increment views
newsSchema.statics.incrementViews = async function (newsId) {
  try {
    const news = await this.findOneAndUpdate(
      { news_id: newsId },
      { $inc: { views: 1 } },
      { new: true }
    );
    return news;
  } catch (error) {
    throw error;
  }
};

// Index for better query performance
newsSchema.index({ news_id: 1 });
newsSchema.index({ news_type: 1 });
newsSchema.index({ posting_date: -1 });
newsSchema.index({ status: 1 });
newsSchema.index({ heading: "text", news: "text" });

const News = mongoose.model("News", newsSchema);

module.exports = News;
