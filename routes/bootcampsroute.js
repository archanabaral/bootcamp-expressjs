const express = require("express");
const BootcampController = require("../controllers/bootcamps");
const Bootcamp = require("../models/bootcampmodels");
const advancedResults = require("../middleware/advancedResults");
//include other resource routers
const courseRouter = require("./coursesroute");
const reviewRouter = require("./reviews");
const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

//Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);

router
  .route("/radius/:zipcode/:distance")
  .get(BootcampController.getBootcampsInRadius);

router
  .route("/:id/photo")
  .put(
    protect,
    authorize("publisher", "admin"),
    BootcampController.bootcampPhotoUpload
  );

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), BootcampController.getBootcamps)
  .post(
    protect,
    authorize("publisher", "admin"),
    BootcampController.CreateBootcamps
  );
router
  .route("/:id")
  .get(BootcampController.getBootcamp)
  .put(
    protect,
    authorize("publisher", "admin"),
    BootcampController.UpdateBootcamps
  )
  .delete(
    protect,
    authorize("publisher", "admin"),
    BootcampController.DeleteBootcamps
  );

module.exports = router;
