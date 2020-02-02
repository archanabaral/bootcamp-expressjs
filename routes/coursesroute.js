const express = require("express");
const CoursesController = require("../controllers/courses");
const Course = require("../models/coursemodels");

const router = express.Router({ mergeParams: true }); //for merging that incoming params to base route i.e :bootcampId/courses to /

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResults(Course, { path: "bootcamp", select: "name description" }),
    CoursesController.getCourses
  )
  .post(
    protect,
    authorize("publisher", "admin"),
    CoursesController.createCourse
  );
router
  .route("/:id")
  .get(CoursesController.getCourse)
  .put(protect, authorize("publisher", "admin"), CoursesController.updateCourse)
  .delete(
    protect,
    authorize("publisher", "admin"),
    CoursesController.deleteCourse
  );

module.exports = router;
