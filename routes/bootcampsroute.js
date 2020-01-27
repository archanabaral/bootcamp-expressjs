const express = require("express");
const BootcampController = require("../controllers/bootcamps");
const Bootcamp = require("../models/bootcampmodels");
const advancedResults = require("../middleware/advancedResults");
//include other resource routers
const courseRouter = require("./coursesroute");
const router = express.Router();

//Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

router
  .route("/radius/:zipcode/:distance")
  .get(BootcampController.getBootcampsInRadius);

router.route("/:id/photo").put(BootcampController.bootcampPhotoUpload);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), BootcampController.getBootcamps)
  .post(BootcampController.CreateBootcamps);
router
  .route("/:id")
  .get(BootcampController.getBootcamp)
  .put(BootcampController.UpdateBootcamps)
  .delete(BootcampController.DeleteBootcamps);

module.exports = router;
