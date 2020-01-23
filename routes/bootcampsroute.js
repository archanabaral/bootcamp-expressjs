const express = require("express");
const BootcampController = require("../controllers/bootcamps");
const router = express.Router();
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
