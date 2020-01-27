const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/usermodels");

//route GET/api/v1/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body; //pulling these stuff out from req.body

    //create user
    const user = await User.create({
      name,
      email,
      password,
      role
    });
    res.status(200).json({
      success: true
    });
  } catch (err) {
    console.log(err);
  }
};
