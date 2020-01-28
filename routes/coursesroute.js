const express = require("express");
const CoursesController = require("../controllers/courses");
const Course = require("../models/coursemodels");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true }); //for merging that incoming params to base route i.e :bootcampId/courses to /

const { protect } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResults(Course, { path: "bootcamp", select: "name description" }),
    CoursesController.getCourses
  )
  .post(protect, CoursesController.createCourse);
router
  .route("/:id")
  .get(CoursesController.getCourse)
  .put(protect, CoursesController.updateCourse)
  .delete(protect, CoursesController.deleteCourse);

module.exports = router;
