const express = require("express");
const CoursesController = require("../controllers/courses");
const Course = require("../models/coursemodels");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true }); //for merging that incoming params to base route i.e :bootcampId/courses to /

router
  .route("/")
  .get(
    advancedResults(Course, {path: "bootcamp",select:"name description"}),
    CoursesController.getCourses
  )
  .post(CoursesController.createCourse);
router
  .route("/:id")
  .get(CoursesController.getCourse)
  .put(CoursesController.updateCourse)
  .delete(CoursesController.deleteCourse);

module.exports = router;
