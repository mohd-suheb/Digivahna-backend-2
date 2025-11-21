const express = require("express");
const router = express.Router();
const {
  handleValidationErrors,
  commonValidations,
} = require("../middleware/validation.js");
const {
  getNewsList,
  getNewsById,
  getNewsByType,
} = require("../controllers/getNewsController.js");
const { API_ROUTES } = require("../../constants/apiRoutes.js");

// Get News List - Fetch news with pagination
router.get(
  API_ROUTES.GET_NEWS_UPDATE.GET_LIST,
  [
    // Optional validation for query parameters
    commonValidations.optionalLimit("limit"),
    commonValidations.optionalPage("page"),
    commonValidations.optionalNewsType("news_type"),
    handleValidationErrors,
  ],
  getNewsList
);

// Get News by ID - Get specific news article
router.get(
  API_ROUTES.GET_NEWS_UPDATE.GET_BY_ID,
  [commonValidations.newsIdParam("news_id"), handleValidationErrors],
  getNewsById
);

// Get News by Type - Get news filtered by type
router.get(
  API_ROUTES.GET_NEWS_UPDATE.GET_BY_TYPE,
  [
    commonValidations.newsTypeParam("news_type"),
    commonValidations.optionalLimit("limit"),
    commonValidations.optionalPage("page"),
    handleValidationErrors,
  ],
  getNewsByType
);

module.exports = router;
