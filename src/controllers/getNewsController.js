const News = require("../models/News");
const { SUCCESS_MESSAGES, ERROR_MESSAGES } = require("../../constants");

/**
 * Get News List - Fetch news with pagination
 * GET /api/user/news/list
 */
const getNewsList = async (req, res) => {
  try {
    // Extract query parameters
    const { 
      limit = 10, 
      page = 1, 
      news_type = null 
    } = req.query;

    // Validate limit parameter
    const parsedLimit = parseInt(limit);
    if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Validate page parameter
    const parsedPage = parseInt(page);
    if (isNaN(parsedPage) || parsedPage < 1) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Calculate skip value for pagination
    const skip = (parsedPage - 1) * parsedLimit;

    // Validate news_type if provided
    if (news_type && news_type.trim() !== "") {
      const validNewsTypes = [
        "automotive",
        "technology", 
        "safety",
        "environment",
        "business",
        "government",
        "general",
        "breaking",
        "featured"
      ];

      if (!validNewsTypes.includes(news_type.trim())) {
        return res.status(400).json({
          status: false,
          error_type: "Invalid parameter",
          message: ERROR_MESSAGES.INVALID_PARAMETER,
        });
      }
    }

    // Get news list with pagination
    const result = await News.getNewsList(parsedLimit, skip, news_type);

    // Format the response data
    const formattedNews = result.news.map(news => ({
      news_id: news.news_id,
      banner: news.banner,
      posting_date: news.posting_date ? news.posting_date.toISOString().split('T')[0] : null,
      news_type: news.news_type || "",
      heading: news.heading,
      sub_description: news.sub_description || "",
      description: news.description || ""
    }));

    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.NEWS_LIST_FETCHED_SUCCESSFULLY,
      data: formattedNews,
    });

  } catch (error) {
    console.error("Get news list error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_NOT_WORKING,
    });
  }
};

/**
 * Get News by ID - Get specific news article
 * GET /api/user/news/:news_id
 */
const getNewsById = async (req, res) => {
  try {
    const { news_id } = req.params;

    // Validate news_id parameter
    if (!news_id) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Get news by news_id
    const news = await News.getNewsById(news_id);
    if (!news) {
      return res.status(404).json({
        status: false,
        error_type: "other",
        message: ERROR_MESSAGES.NEWS_NOT_FOUND,
      });
    }

    // Increment views
    await News.incrementViews(news_id);

    // Format the response data
    const formattedNews = {
      news_id: news.news_id,
      banner: news.banner,
      posting_date: news.posting_date ? news.posting_date.toISOString().split('T')[0] : null,
      news_type: news.news_type || "",
      heading: news.heading,
      sub_description: news.sub_description || "",
      description: news.description || "",
      news: news.news,
      views: news.views,
      tags: news.tags || []
    };

    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.NEWS_FETCHED_SUCCESSFULLY,
      data: formattedNews,
    });

  } catch (error) {
    console.error("Get news by ID error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_NOT_WORKING,
    });
  }
};

/**
 * Get News by Type - Get news filtered by type
 * GET /api/user/news/type/:news_type
 */
const getNewsByType = async (req, res) => {
  try {
    const { news_type } = req.params;
    const { limit = 10, page = 1 } = req.query;

    // Validate news_type parameter
    if (!news_type) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
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
      "featured"
    ];

    if (!validNewsTypes.includes(news_type)) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Validate limit and page parameters
    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);
    
    if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    if (isNaN(parsedPage) || parsedPage < 1) {
      return res.status(400).json({
        status: false,
        error_type: "Invalid parameter",
        message: ERROR_MESSAGES.INVALID_PARAMETER,
      });
    }

    // Calculate skip value for pagination
    const skip = (parsedPage - 1) * parsedLimit;

    // Get news by type with pagination
    const result = await News.getNewsList(parsedLimit, skip, news_type);

    // Format the response data
    const formattedNews = result.news.map(news => ({
      news_id: news.news_id,
      banner: news.banner,
      posting_date: news.posting_date ? news.posting_date.toISOString().split('T')[0] : null,
      news_type: news.news_type || "",
      heading: news.heading,
      sub_description: news.sub_description || "",
      description: news.description || ""
    }));

    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.NEWS_LIST_FETCHED_SUCCESSFULLY,
      data: formattedNews,
    });

  } catch (error) {
    console.error("Get news by type error:", error);
    res.status(500).json({
      status: false,
      error_type: "other",
      message: ERROR_MESSAGES.SERVER_NOT_WORKING,
    });
  }
};

module.exports = {
  getNewsList,
  getNewsById,
  getNewsByType,
};

