const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");
const bootcamps = require("../models/bootcampmodels");

exports.getBootcamps = async (req, res, next) => {
  try {
    //console.log(req.query)
    let query;

    //copy req.query
    const reqQuery = { ...req.query };

    //Array of fields to exclude that i dont want to be matched for filtering
    const removeFields = ["select",'sort'];

    //loop over removeFields and delete them from reqQuery
    removeFields.forEach(value => delete reqQuery[value]);

    console.log(reqQuery);

    //create query string
    let queryStr = JSON.stringify(reqQuery);

    //create operators (&gt,&gte,etc)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      match => `$${match}`
    );

    console.log(queryStr);

    //finding resource
    query = bootcamps.find(JSON.parse(queryStr));

    //if select fields is included then do this
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      //console.log(fields);
      query = query.select(fields);
    }
    //Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" "); query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //const bootcamp = await bootcamps.find();

    //executing query
    const bootcamp = await query;

    res.status(200).json({
      success: true,
      count: bootcamp.length,
      data: bootcamp
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err
    });
  }
};
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await bootcamps.findById(req.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(
          `bootcamp of this id  ${req.params.id} is not available`,
          404
        )
      );
    }
    res.status(200).json({
      success: true,
      data: bootcamp
    });
  } catch (err) {
    // res.status(400).json({
    //   success: false,
    //   message: err
    // });
    next(
      new ErrorResponse(`bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
};
exports.CreateBootcamps = async (req, res, next) => {
  try {
    const bootcamp = await bootcamps.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err
    });
    console.log(err);
  }
};
exports.UpdateBootcamps = async (req, res, next) => {
  try {
    const bootcamp = await bootcamps.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({
      success: true,
      data: bootcamp
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err
    });
  }
};
exports.DeleteBootcamps = async (req, res, next) => {
  try {
    const bootcamp = await bootcamps.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err
    });
  }
};

//getting bootcamps within a radius
//route GET/api/v1/bootcamps/radius/:zipcode/:distance

exports.getBootcampsInRadius = async (req, res, next) => {
  try {
    const { zipcode, distance } = req.params;
    //get latitude and longitude from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude; //loc is array with the object
    const lng = loc[0].longitude;

    //calculate radius using radians
    //divide distance by radius of earth
    //earth radius=3963 miles
    const radius = distance / 3963;
    const bootcamp = await bootcamps.find({
      location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });
    res.status(200).json({
      success: true,
      count: bootcamp.length,
      data: bootcamp
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err
    });
    console.log(err);
  }
};
