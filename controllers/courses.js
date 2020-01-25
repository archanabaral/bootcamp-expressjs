const ErrorResponse = require("../utils/errorResponse");
const Course = require("../models/coursemodels");

//route api/v1/courses (this is gonna get all the courses)
//route GET/api/v1/bootcamps/:bootcampId/courses(this gets all the courses for the specific bootcamp)
exports.getCourses = async (req, res, next) => {
  try {
    let query;
    if (req.params.bootcampId) {
      query = Course.find({ bootcamp: req.params.bootcampId }); //this means yedi maile query ma haneko id(i.e req.params.bootcampId) xai bootcamp ma already vako id sanga match vayo vane yo route GET/api/v1/bootcamps/:bootcampId/courses run hunxa
    } else {
      query = Course.find().populate({
        path:'bootcamp',
        select:'name description'
      });
    }
    const courses = await query;
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (err) {
    next(err);
    console.log(err);
  }
};
