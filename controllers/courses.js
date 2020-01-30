const ErrorResponse = require("../utils/errorResponse");
const Course = require("../models/coursemodels");
const Bootcamp = require("../models/bootcampmodels");

//route api/v1/courses (this is gonna get all the courses)
//route GET/api/v1/bootcamps/:bootcampId/courses(this gets all the courses for the specific bootcamp)
exports.getCourses = async (req, res, next) => {
  try {
    //let query;
    if (req.params.bootcampId) {
      const courses = Course.find({ bootcamp: req.params.bootcampId });
      return res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
      });
    } else {
      res.status(200).json(res.advancedResults);
      // query = Course.find().populate({
      //   path: "bootcamp",
      //   select: "name description"
      // });
    }
    //   const courses = await query;
    //   res.status(200).json({
    //     success: true,
    //     count: courses.length,
    //     data: courses
    //   });
  } catch (err) {
    next(err);
    console.log(err);
  }
};
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate({
      path: "bootcamp",
      select: "name description"
    });
    if (!course) {
      return next(
        new ErrorResponse(`No course with id of ${req.params.id},404`)
      );
    }
    res.status(200).json({
      success: true,
      data: course
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//to create course
//route POST/api/v1/bootcamps/:bootcampId/courses
exports.createCourse = async (req, res, next) => {
  try {
    req.body.bootcamp = req.params.bootcampId; //here bootcamp is refering to bootcamp that is in courses model as field
    req.body.UserId = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp) {
      return next(
        new ErrorResponse(`No bootcamp with id of ${req.params.bootcampId},404`)
      );
    }
    //authorized bootcamp owner can create courses
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        new ErrorResponse(
          `User  ${req.user.id} is not authorized to create a course to bootcamp ${bootcamp._id}`,
          401
        )
      );
    }

    const course = await Course.create(req.body);
    res.status(200).json({
      success: true,
      data: course
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
exports.updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!course) {
      return next(
        new ErrorResponse(`No course with id of ${req.params.id},404`)
      );
    }
    //make sure user is course owner
    if (course.UserId.toString()!== req.user.id && req.user.role !== "admin") {
      return next(
        new ErrorResponse(
          `User  ${req.user.id} is not authorized to update a course  ${course._id}`,
          401
        )
      );
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (err) {
    next(err);
  }
};
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return next(
        new ErrorResponse(`No course with id of ${req.params.id},404`)
      );
    }
    if (course.UserId.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        new ErrorResponse(
          `User  ${req.user.id} is not authorized to delete a course  ${course._id}`,
          401
        )
      );
    }
    await course.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};
