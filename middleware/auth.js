const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/usermodels");

//protect routes
exports.protect = async (req, res, next) => {
  try {
    console.log(req);
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    //Make sure token exists
    if (!token) {
      return next(
        new ErrorResponse("not authorized to access this route", 401)
      );
    }

    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = await User.findById(decoded.id);
  } catch (err) {
    console.log(err);
  }
  next();
};
