const express = require("express");
const router = express.Router();
const {
  handleValidationErrors,
  commonValidations,
} = require("../middleware/validation.js");
const {
  postNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
} = require("../controllers/newsController.js");
const { API_ROUTES } = require("../../constants/apiRoutes.js");

// Post News - Create new news article
router.post(
  API_ROUTES.NEWS.POST_NEWS,
  [
    // Validation for news posting
    commonValidations.newsBanner("banner"),
    commonValidations.newsType("news_type"),
    commonValidations.newsHeading("heading"),
    commonValidations.newsContent("news"),
    handleValidationErrors,
  ],
  postNews
);

// Get All News - Get all published news
router.get(
  API_ROUTES.NEWS.GET_ALL_NEWS,
  [
    // Optional validation for query parameters
    commonValidations.optionalNewsType("news_type"),
    handleValidationErrors,
  ],
  getAllNews
);

// Get News by ID - Get specific news article
router.get(
  API_ROUTES.NEWS.GET_NEWS_BY_ID,
  [commonValidations.newsIdParam("news_id"), handleValidationErrors],
  getNewsById
);

// Update News - Update existing news article
router.put(
  API_ROUTES.NEWS.UPDATE_NEWS,
  [
    commonValidations.newsIdParam("news_id"),
    commonValidations.optionalNewsBanner("banner"),
    commonValidations.optionalNewsType("news_type"),
    commonValidations.optionalNewsHeading("heading"),
    commonValidations.optionalNewsContent("news"),
    handleValidationErrors,
  ],
  updateNews
);

// Delete News - Delete news article
router.delete(
  API_ROUTES.NEWS.DELETE_NEWS,
  [commonValidations.newsIdParam("news_id"), handleValidationErrors],
  deleteNews
);

module.exports = router;
