const express = require("express");
const { protect } = require("../../middleware/auth");
const {
  register,
  login,
  getMe,
  updateDetails,
} = require("../controllers/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/updatedetails", protect, updateDetails);

module.exports = router;
