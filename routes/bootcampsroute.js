const express = require("express");
const BootcampController = require("../controllers/bootcamps");
const Bootcamp = require("../models/bootcampmodels");
const advancedResults = require("../middleware/advancedResults");
//include other resource routers
const courseRouter = require("./coursesroute");
const router = express.Router();

const { protect } = require("../middleware/auth");

//Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

router
  .route("/radius/:zipcode/:distance")
  .get(BootcampController.getBootcampsInRadius);

router.route("/:id/photo").put(protect, BootcampController.bootcampPhotoUpload);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), BootcampController.getBootcamps)
  .post(protect, BootcampController.CreateBootcamps);
router
  .route("/:id")
  .get(BootcampController.getBootcamp)
  .put(protect, BootcampController.UpdateBootcamps)
  .delete(protect, BootcampController.DeleteBootcamps);

module.exports = router;
