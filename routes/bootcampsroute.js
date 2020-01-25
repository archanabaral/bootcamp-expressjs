const express = require("express");
const BootcampController = require("../controllers/bootcamps");
//include other resource routers
const courseRouter=require('./coursesroute');
const router = express.Router();

//Re-route into other resource routers
router.use('/:bootcampId/courses',courseRouter);

router.route('/radius/:zipcode/:distance')
      .get(BootcampController.getBootcampsInRadius);
router
  .route("/")
  .get(BootcampController.getBootcamps)
  .post(BootcampController.CreateBootcamps);
router
  .route("/:id")
  .get(BootcampController.getBootcamp)
  .put(BootcampController.UpdateBootcamps)
  .delete(BootcampController.DeleteBootcamps);

module.exports = router;
