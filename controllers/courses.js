const ErrorResponse = require("../utils/errorResponse");
const Course = require("../models/coursemodels");

//route api/v1/courses (this is gonna get all the courses)
//route GET/api/v1/bootcamps/:bootcampId/courses(this gets all the courses for the specific bootcamp)
exports.getCourses = async (req, res, next) => {
  try {
    let query;
    if (req.params.bootcampId) {
      query = Course.find({ bootcamp: req.params.bootcampId });
    } else {
      query = Course.find();
    }
    const courses = await query;
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (err) {
    console.log(err);
  }
};
