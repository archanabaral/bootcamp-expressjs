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
    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.log(err);
  }
};

//route POST/api/v1/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //Vlidate email and password
    if (!email || !password) {
      return next(
        new ErrorResponse("please provide an email and password", 400)
      );
    }
    //check for user
    const user = await User.findOne({ email: email }).select("+password"); //now findOne method will match the email we searched for with the email in database including password

    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }
    //check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }
    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.log(err);
  }
};
//Get token from model,create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken(); //static(User) would be called on the model itself but method will be called on each user created i.e user
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true //to access cookie only through client side script
  };
  res
    .status(statusCode)
    .cookie("token", token, options) //its gonna take a key i.e what is the cookie called (here we call it token) and value which is token
    .json({
      success: true,
      token
    });
};

//Get current logged in user
//route POST/api/v1/auth/me

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id); //we have access to req.user(which is always gonna be the loggedin user) because we are using protect route
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.log(err);
  }
};
