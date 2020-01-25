const express = require("express");
const CoursesController = require("../controllers/courses");

const router = express.Router({ mergeParams: true }); //for merging that incoming params to base route i.e :bootcampId/courses to /

router
  .route("/")
  .get(CoursesController.getCourses)
  .post(CoursesController.createCourse);
router.route("/:id").get(CoursesController.getCourse);

module.exports = router;
