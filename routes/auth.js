const express = require("express");
const { register, login, getMe,forgetPassword,resetPassword} = require("../controllers/auth");

const router = express.Router();
const { protect } = require("../middleware/auth");

router
  .post("/register", register)
  .post("/login", login)
  .get("/me", protect, getMe)
  .post("/forgetPassword", forgetPassword)
  .put("/resetPassword/:resettoken", resetPassword);

module.exports = router;
