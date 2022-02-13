const path = require("path");
const ErrorResponse = require("../../utills/errorResponse");
const asyncHandler = require("../../middleware/async");
const User = require("../models/User");

// @desc  Upload foto for bootcamp
// @route  PUT /api/v1/user/:id/photo
// @access  Public

exports.userPhotoUpload = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User with id ${req.params.id} not found`, 404)
    );
  }

  //Make sure user is the owner
  if (user._id.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to perform  action`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.photo;

  // Make sure file is a foto
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload a valid image`, 400));
  }

  //Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload a file less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  //Create custom filename
  file.name = `photo_${user._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      return next(
        new ErrorResponse(`There was a problem uploading a file.`, 500)
      );
    }

    await User.findByIdAndUpdate(req.params.id, {
      photo: file.name,
    });

    res.status(200).json({
      success: true,
      data: `${process.env.FILE_UPLOAD_PATH}/${file.name}`,
    });
  });
});
