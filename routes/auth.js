const express = require("express");
const {
  register,
  login,
  getMe,
  forgetPassword,
  resetPassword,
  updateDetails,
  updatePassword
} = require("../controllers/auth");

const router = express.Router();
const { protect } = require("../middleware/auth");

router
  .post("/register", register)
  .post("/login", login)
  .get("/me", protect, getMe)
  .put("/updatedetails", protect, updateDetails)
  .put("/updatepassword", protect, updatePassword)
  .post("/forgetPassword", forgetPassword)
  .put("/resetPassword/:resettoken", resetPassword);

module.exports = router;
