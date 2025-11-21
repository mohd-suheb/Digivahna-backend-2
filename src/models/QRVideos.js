const mongoose = require("mongoose");

// QR Videos Schema
const qrVideosSchema = new mongoose.Schema(
  {
    tutorial_video_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    tutorial_video: {
      type: String,
      required: true,
      trim: true,
    },
    tutorial_thumbnail: {
      type: String,
      required: false,
      trim: true,
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
      enum: ["active", "inactive", "archived"],
      default: "active",
    },
    views: {
      type: Number,
      default: 0,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Pre-save middleware to update updated_at timestamp
qrVideosSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

// Static method to generate unique tutorial_video_id
qrVideosSchema.statics.generateTutorialVideoId = async function () {
  let videoId;
  let isUnique = false;
  
  while (!isUnique) {
    // Generate tutorial_video_id in format: qr_video_XXXXX
    const randomNum = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    videoId = `qr_video_${randomNum}`;
    
    // Check if tutorial_video_id already exists
    const existingVideo = await this.findOne({ tutorial_video_id: videoId });
    if (!existingVideo) {
      isUnique = true;
    }
  }
  
  return videoId;
};

// Static method to add new QR video
qrVideosSchema.statics.addQRVideo = async function (videoData) {
  try {
    // Generate unique tutorial_video_id
    const videoId = await this.generateTutorialVideoId();
    
    // Create new QR video document
    const newVideo = new this({
      tutorial_video_id: videoId,
      ...videoData,
    });
    
    // Save to database
    const savedVideo = await newVideo.save();
    return savedVideo;
  } catch (error) {
    throw error;
  }
};

// Static method to get all QR videos
qrVideosSchema.statics.getAllQRVideos = async function (limit = 50, skip = 0) {
  try {
    const videos = await this.find({ status: "active" })
      .sort({ order: 1, created_at: -1 })
      .limit(limit)
      .skip(skip);
    return videos;
  } catch (error) {
    throw error;
  }
};

// Static method to get QR video by tutorial_video_id
qrVideosSchema.statics.getQRVideoById = async function (videoId) {
  try {
    const video = await this.findOne({ tutorial_video_id: videoId });
    return video;
  } catch (error) {
    throw error;
  }
};

// Static method to update QR video
qrVideosSchema.statics.updateQRVideo = async function (videoId, videoData) {
  try {
    const updatedVideo = await this.findOneAndUpdate(
      { tutorial_video_id: videoId },
      { 
        ...videoData,
        updated_at: new Date()
      },
      { new: true, runValidators: true }
    );
    return updatedVideo;
  } catch (error) {
    throw error;
  }
};

// Static method to delete QR video
qrVideosSchema.statics.deleteQRVideo = async function (videoId) {
  try {
    const deletedVideo = await this.findOneAndDelete({ tutorial_video_id: videoId });
    return deletedVideo;
  } catch (error) {
    throw error;
  }
};

// Static method to increment views
qrVideosSchema.statics.incrementViews = async function (videoId) {
  try {
    const video = await this.findOneAndUpdate(
      { tutorial_video_id: videoId },
      { $inc: { views: 1 } },
      { new: true }
    );
    return video;
  } catch (error) {
    throw error;
  }
};

// Index for better query performance
qrVideosSchema.index({ tutorial_video_id: 1 });
qrVideosSchema.index({ status: 1 });
qrVideosSchema.index({ order: 1 });
qrVideosSchema.index({ created_at: -1 });
qrVideosSchema.index({ title: "text" });

const QRVideos = mongoose.model("QRVideos", qrVideosSchema);

module.exports = QRVideos;

