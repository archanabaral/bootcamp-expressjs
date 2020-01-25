const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");
const bootcamps = require("../models/bootcampmodels");

exports.getBootcamps = async (req, res, next) => {
  try {
    //console.log(req.query)
    let query;

    //copy req.query
    const reqQuery = { ...req.query };

    //Array of fields to exclude that i dont want to be matched for filtering i.e if we donot exclude sort,select then it will think them as a field and try to match it with the fields that are in our document
    const removeFields = ["select", "sort", "page", "limit"];

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
    query = bootcamps.find(JSON.parse(queryStr)).populate('courses');

    //if select fields is included then do this
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      //console.log(fields);
      query = query.select(fields);
    }
    //Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }
    //pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await bootcamps.countDocuments();

    query = query.skip(skip).limit(limit);

    //const bootcamp = await bootcamps.find();

    //executing query
    const bootcamp = await query;

    //pagination results
    const pagination = {};
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit: limit
      };
    }
    if (skip > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    console.log(pagination);
    res.status(200).json({
      success: true,
      count: bootcamp.length,
      pagination,
      data: bootcamp
    });
  } catch (err) {
    next(err);
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
    // next(
    //   new ErrorResponse(`bootcamp not found with id of ${req.params.id}`, 404)
    // );
    next(err);
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
    next(err);
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
    next(err);
  }
};
exports.DeleteBootcamps = async (req, res, next) => {
  try {
    const bootcamp = await bootcamps.findById(req.params.id);

    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }
    bootcamp.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
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
    next(err);
  }
};
