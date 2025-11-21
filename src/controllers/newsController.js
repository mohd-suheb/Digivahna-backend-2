const News = require("../models/News");
const { SUCCESS_MESSAGES, ERROR_MESSAGES } = require("../../constants");

/**
 * Post News - Create new news article
 * POST /api/admin/news-post
 */
const postNews = async (req, res) => {
  try {
    const { banner, news_type, heading, news, sub_description, description } =
      req.body;

    // Validate required fields
    if (!banner || !news_type || !heading || !news) {
      return res.status(400).json({
        status: false,
        message: ERROR_MESSAGES.FAILED_TO_POST_NEWS,
      });
    }

    // Validate news_type enum
    const validNewsTypes = [
      "automotive",
      "technology",
      "safety",
      "environment",
      "business",
      "government",
      "general",
      "breaking",
      "featured",
    ];

    if (!validNewsTypes.includes(news_type)) {
      return res.status(400).json({
        status: false,
        message: ERROR_MESSAGES.INVALID_NEWS_TYPE,
      });
    }

    // Validate string fields
    if (
      typeof banner !== "string" ||
      typeof heading !== "string" ||
      typeof news !== "string"
    ) {
      return res.status(400).json({
        status: false,
        message: ERROR_MESSAGES.FAILED_TO_POST_NEWS,
      });
    }

    // Validate optional string fields if provided
    if (sub_description !== undefined && typeof sub_description !== "string") {
      return res.status(400).json({
        status: false,
        message: ERROR_MESSAGES.FAILED_TO_POST_NEWS,
      });
    }

    if (description !== undefined && typeof description !== "string") {
      return res.status(400).json({
        status: false,
        message: ERROR_MESSAGES.FAILED_TO_POST_NEWS,
      });
    }

    // Validate field lengths
    if (
      banner.trim().length === 0 ||
      heading.trim().length === 0 ||
      news.trim().length === 0
    ) {
      return res.status(400).json({
        status: false,
        message: ERROR_MESSAGES.FAILED_TO_POST_NEWS,
      });
    }

    // Prepare news data
    const newsData = {
      banner: banner.trim(),
      news_type: news_type.trim(),
      heading: heading.trim(),
      news: news.trim(),
    };

    // Add optional fields if provided
    if (sub_description !== undefined) {
      newsData.sub_description = sub_description.trim();
    }

    if (description !== undefined) {
      newsData.description = description.trim();
    }

    // Add the new news
    const newNews = await News.addNews(newsData);

    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.NEWS_POSTED_SUCCESSFULLY,
    });
  } catch (error) {
    console.error("Post news error:", error);
    res.status(500).json({
      status: false,
      message: ERROR_MESSAGES.FAILED_TO_POST_NEWS,
    });
  }
};

/**
 * Get All News - Get all published news
 * GET /api/admin/news
 */
const getAllNews = async (req, res) => {
  try {
    const { limit = 50, skip = 0, news_type } = req.query;

    let news;
    if (news_type) {
      news = await News.getNewsByType(news_type, parseInt(limit));
    } else {
      news = await News.getAllNews(parseInt(limit), parseInt(skip));
    }

    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.NEWS_FETCHED_SUCCESSFULLY,
      data: {
        news: news,
        total_count: news.length,
      },
    });
  } catch (error) {
    console.error("Get all news error:", error);
    res.status(500).json({
      status: false,
      message: ERROR_MESSAGES.FAILED_TO_FETCH_NEWS,
    });
  }
};

/**
 * Get News by ID - Get specific news article
 * GET /api/admin/news/:news_id
 */
const getNewsById = async (req, res) => {
  try {
    const { news_id } = req.params;

    // Validate news_id parameter
    if (!news_id) {
      return res.status(400).json({
        status: false,
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Get news by news_id
    const news = await News.getNewsById(news_id);
    if (!news) {
      return res.status(404).json({
        status: false,
        message: ERROR_MESSAGES.NEWS_NOT_FOUND,
      });
    }

    // Increment views
    await News.incrementViews(news_id);

    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.NEWS_FETCHED_SUCCESSFULLY,
      data: {
        news: news,
      },
    });
  } catch (error) {
    console.error("Get news by ID error:", error);
    res.status(500).json({
      status: false,
      message: ERROR_MESSAGES.FAILED_TO_FETCH_NEWS,
    });
  }
};

/**
 * Update News - Update existing news article
 * PUT /api/admin/news/:news_id
 */
const updateNews = async (req, res) => {
  try {
    const { news_id } = req.params;
    const { banner, news_type, heading, news } = req.body;

    // Validate news_id parameter
    if (!news_id) {
      return res.status(400).json({
        status: false,
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Check if news exists
    const existingNews = await News.getNewsById(news_id);
    if (!existingNews) {
      return res.status(404).json({
        status: false,
        message: ERROR_MESSAGES.NEWS_NOT_FOUND,
      });
    }

    // Prepare update data
    const updateData = {};
    if (banner) updateData.banner = banner.trim();
    if (news_type) {
      const validNewsTypes = [
        "automotive",
        "technology",
        "safety",
        "environment",
        "business",
        "government",
        "general",
        "breaking",
        "featured",
      ];
      if (validNewsTypes.includes(news_type)) {
        updateData.news_type = news_type.trim();
      }
    }
    if (heading) updateData.heading = heading.trim();
    if (news) updateData.news = news.trim();

    // Update the news
    const updatedNews = await News.updateNews(news_id, updateData);
    if (!updatedNews) {
      return res.status(404).json({
        status: false,
        message: ERROR_MESSAGES.NEWS_NOT_FOUND,
      });
    }

    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.NEWS_UPDATED_SUCCESSFULLY,
    });
  } catch (error) {
    console.error("Update news error:", error);
    res.status(500).json({
      status: false,
      message: ERROR_MESSAGES.FAILED_TO_UPDATE_NEWS,
    });
  }
};

/**
 * Delete News - Delete news article
 * DELETE /api/admin/news/:news_id
 */
const deleteNews = async (req, res) => {
  try {
    const { news_id } = req.params;

    // Validate news_id parameter
    if (!news_id) {
      return res.status(400).json({
        status: false,
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Delete news
    const deletedNews = await News.deleteNews(news_id);
    if (!deletedNews) {
      return res.status(404).json({
        status: false,
        message: ERROR_MESSAGES.NEWS_NOT_FOUND,
      });
    }

    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.NEWS_DELETED_SUCCESSFULLY,
    });
  } catch (error) {
    console.error("Delete news error:", error);
    res.status(500).json({
      status: false,
      message: ERROR_MESSAGES.FAILED_TO_DELETE_NEWS,
    });
  }
};

module.exports = {
  postNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
};
