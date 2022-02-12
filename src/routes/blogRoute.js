const express = require("express");
const { protect, authorize } = require("../../middleware/auth");
const router = express.Router();
const {
  getBlogs,
  getBlogsById,
  getBlogsByUserId,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogs");

router.route("/").get(getBlogs).post(protect, authorize("user"), createBlog);
router.route("/user/:userId").get(getBlogsByUserId);
router
  .route("/:id")
  .get(getBlogsById)
  .put(protect, authorize("user"), updateBlog)
  .delete(protect, authorize("user"), deleteBlog);

module.exports = router;
