const path = require("path");
const Blog = require("../models/Blog");
const ErrorResponse = require("../../utills/errorResponse");
const asyncHandler = require("../../middleware/async");

// @desc  Get all blogs
// @route  Get /blogs
// @access  Public

exports.getBlogs = asyncHandler(async (req, res, next) => {
  const blogs = await Blog.find().populate("user", "name");

  if (!blogs) {
    return next(new ErrorResponse(`Blogs not found`, 404));
  }

  return res.status(200).json({
    sucess: true,
    count: blogs.length,
    data: blogs,
  });
});

// @desc  Get single blog by id
// @route  Get /blogs/:id
// @access  Public

exports.getBlogsById = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id).populate("user", "name");
  if (!blog) {
    return next(
      new ErrorResponse(`Blog with id ${req.params.id} not found`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: blog,
  });
  next(error);
});

// @desc  Get user blogs
// @route  Get /blogs/:id
// @route  Get /blogs/user/:userId
// @access  Public

exports.getBlogsByUserId = asyncHandler(async (req, res, next) => {
  if (req.params.userId) {
    const blogs = await Blog.find({
      user: req.params.userId,
    });
    return res.status(200).json({
      sucess: true,
      count: blogs.length,
      data: blogs,
    });
  } else {
    return res.status(200).json(res.advancedResults);
  }
});

// @desc  Post single blog
// @route  Post /api/v1/blog
// @access  Private

exports.createBlog = asyncHandler(async (req, res, next) => {
  //Add user to req.body
  req.body.user = req.user.id;

  //Check for user is guest or user
  if (req.user.role !== "user") {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a blog`,
        400
      )
    );
  }

  const blog = await Blog.create(req.body);
  res.status(201).json({
    success: true,
    message: "Blog successfully created",
    data: blog,
  });
  next(error);
});

// @desc  Update blog
// @route  Put /api/v1/blogs/:id
// @access  Private

exports.updateBlog = asyncHandler(async (req, res, next) => {
  let blog = await Blog.findById(req.params.id);
  if (!blog) {
    return next(
      new ErrorResponse(`Blog with id ${req.params.id} not found`, 404)
    );
  }

  //Make sure user is the owner
  if (blog.user.toString !== req.user.id && req.user.role !== "user") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to perform this action`,
        401
      )
    );
  }

  blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    message: "Blog successfully updated",
    data: blog,
  });
  next(error);
});

// @desc  Delete blog
// @route  delete /api/v1/blogs/:id
// @access  Private

exports.deleteBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return next(
      new ErrorResponse(`Blog with id ${req.params.id} not found`, 404)
    );
  }

  //Make sure user is the owner
  if (blog.user.toString !== req.user.id && req.user.role !== "user") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to perform this action`,
        401
      )
    );
  }

  blog.remove();

  res.status(200).json({
    success: true,
    message: "Blog successfully deleted",
    data: {},
  });
  next(error);
});
