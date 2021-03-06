const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/usermodels");

//protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  //console.log(req);
  let token;
  // console.log(req.headers.authorization);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  //set token from cookie
  //  else if (req.cookies.token) {
  //    token = req.cookies.token;
  //  }

  //Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not Authorized to access this route", 401));
  }
  try {
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded); //extracting a payload
    req.user = await User.findById(decoded.id);
    //console.log(req.user);
    next();
  } catch (err) {
    return next(new ErrorResponse("not authorized to access this route", 401));
  }
});
//Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `user role${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
