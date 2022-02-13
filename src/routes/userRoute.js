const express = require("express");
const { protect, authorize } = require("../../middleware/auth");
const router = express.Router();
const { userPhotoUpload } = require("../controllers/user");

router.route("/:id/photo").put(protect, authorize("user"), userPhotoUpload);

module.exports = router;
