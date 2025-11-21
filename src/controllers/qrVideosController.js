const QRVideos = require("../models/QRVideos");
const { SUCCESS_MESSAGES, ERROR_MESSAGES } = require("../../constants");

/**
 * QR Benefit Videos - Manipulate QR service benefit videos list
 * POST /api/qr-benefit-videos
 */
const qrBenefitVideos = async (req, res) => {
  try {
    const { tutorial_video_id, title, tutorial_video, tutorial_thumbnail } = req.body;

    // Case 1: Update existing video (all parameters provided)
    if (tutorial_video_id && title && tutorial_video) {
      // Check if video exists
      const existingVideo = await QRVideos.getQRVideoById(tutorial_video_id);
      if (!existingVideo) {
        return res.status(404).json({
          status: false,
          error_type: "other",
          message: ERROR_MESSAGES.VIDEO_NOT_FOUND,
        });
      }

      // Prepare update data
      const updateData = {
        title: title.trim(),
        tutorial_video: tutorial_video.trim(),
      };

      // Add thumbnail if provided
      if (tutorial_thumbnail) {
        updateData.tutorial_thumbnail = tutorial_thumbnail.trim();
      }

      // Update the video
      const updatedVideo = await QRVideos.updateQRVideo(tutorial_video_id, updateData);
      if (!updatedVideo) {
        return res.status(404).json({
          status: false,
          error_type: "other",
          message: ERROR_MESSAGES.VIDEO_NOT_FOUND,
        });
      }

      return res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGES.USER_TUTORIAL_VIDEO_UPDATED_SUCCESSFULLY,
      });
    }

    // Case 2: Add new video (title and tutorial_video provided, no tutorial_video_id)
    if (title && tutorial_video && !tutorial_video_id) {
      // Validate required fields
      if (!title.trim() || !tutorial_video.trim()) {
        return res.status(400).json({
          status: false,
          error_type: "Invalid parameter",
          message: ERROR_MESSAGES.INVALID_PARAMETER,
        });
      }

      // Prepare video data
      const videoData = {
        title: title.trim(),
        tutorial_video: tutorial_video.trim(),
      };

      // Add thumbnail if provided
      if (tutorial_thumbnail) {
        videoData.tutorial_thumbnail = tutorial_thumbnail.trim();
      }

      // Add the new video
      const newVideo = await QRVideos.addQRVideo(videoData);

      return res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGES.USER_TUTORIAL_VIDEO_ADDED_SUCCESSFULLY,
      });
    }

    // Case 3: Delete video (only tutorial_video_id provided)
    if (tutorial_video_id && !title && !tutorial_video) {
      // Check if video exists
      const existingVideo = await QRVideos.getQRVideoById(tutorial_video_id);
      if (!existingVideo) {
        return res.status(404).json({
          status: false,
          error_type: "other",
          message: ERROR_MESSAGES.VIDEO_NOT_FOUND,
        });
      }

      // Delete the video
      const deletedVideo = await QRVideos.deleteQRVideo(tutorial_video_id);
      if (!deletedVideo) {
        return res.status(404).json({
          status: false,
          error_type: "other",
          message: ERROR_MESSAGES.VIDEO_NOT_FOUND,
        });
      }

      return res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGES.USER_TUTORIAL_VIDEO_DELETED_SUCCESSFULLY,
      });
    }

    // Invalid parameter combination
    return res.status(400).json({
      status: false,
      error_type: "Invalid parameter",
      message: ERROR_MESSAGES.INVALID_PARAMETER,
    });

  } catch (error) {
    console.error("QR benefit videos error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_NOT_WORKING,
    });
  }
};

/**
 * Get All QR Videos - Get all QR benefit videos
 * GET /api/qr-benefit-videos
 */
const getAllQRVideos = async (req, res) => {
  try {
    // Get all QR videos (no pagination for this endpoint as per requirements)
    const videos = await QRVideos.getAllQRVideos();

    // Format the response data to match exact requirements
    const formattedVideos = videos.map(video => ({
      tutorial_video_id: video.tutorial_video_id,
      title: video.title,
      tutorial_video: video.tutorial_video,
      tutorial_thumbnail: video.tutorial_thumbnail || "url", // Default to "url" if not provided
      dateAdded: video.created_at ? video.created_at.toISOString().split('T')[0] : null
    }));

    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.VIDEOS_FETCHED_SUCCESSFULLY,
      data: formattedVideos,
    });

  } catch (error) {
    console.error("Get all QR videos error:", error);
    res.status(500).json({
      status: false,
      message: ERROR_MESSAGES.SERVER_ERROR_WHILE_FETCHING_VIDEOS,
    });
  }
};

/**
 * Get QR Video by ID - Get specific QR video
 * GET /api/qr-benefit-videos/:tutorial_video_id
 */
const getQRVideoById = async (req, res) => {
  try {
    const { tutorial_video_id } = req.params;

    // Validate tutorial_video_id parameter
    if (!tutorial_video_id) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Get QR video by tutorial_video_id
    const video = await QRVideos.getQRVideoById(tutorial_video_id);
    if (!video) {
      return res.status(404).json({
        status: false,
        error_type: "other",
        message: ERROR_MESSAGES.VIDEO_NOT_FOUND,
      });
    }

    // Increment views
    await QRVideos.incrementViews(tutorial_video_id);

    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.QR_VIDEO_FETCHED_SUCCESSFULLY,
      data: {
        video: video,
      },
    });

  } catch (error) {
    console.error("Get QR video by ID error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_NOT_WORKING,
    });
  }
};

module.exports = {
  qrBenefitVideos,
  getAllQRVideos,
  getQRVideoById,
};
