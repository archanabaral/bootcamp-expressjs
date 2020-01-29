const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");
const bootcamps = require("../models/bootcampmodels");

exports.getBootcamps = async (req, res, next) => {
  try {
    //   //console.log(req.query)
    //   let query;

    //   //copy req.query
    //   const reqQuery = { ...req.query };

    //   //Array of fields to exclude that i dont want to be matched for filtering i.e if we donot exclude sort,select then it will think them as a field and try to match it with the fields that are in our document
    //   const removeFields = ["select", "sort", "page", "limit"];

    //   //loop over removeFields and delete them from reqQuery
    //   removeFields.forEach(value => delete reqQuery[value]);

    //   console.log(reqQuery);

    //   //create query string
    //   let queryStr = JSON.stringify(reqQuery);

    //   //create operators (&gt,&gte,etc)
    //   queryStr = queryStr.replace(
    //     /\b(gt|gte|lt|lte|in)\b/g,
    //     match => `$${match}`
    //   );

    //   console.log(queryStr);

    //   //finding resource
    //   query = bootcamps.find(JSON.parse(queryStr)).populate("courses");

    //   //if select fields is included then do this
    //   if (req.query.select) {
    //     const fields = req.query.select.split(",").join(" ");
    //     //console.log(fields);
    //     query = query.select(fields);
    //   }
    //   //Sort
    //   if (req.query.sort) {
    //     const sortBy = req.query.sort.split(",").join(" ");
    //     query = query.sort(sortBy);
    //   } else {
    //     query = query.sort("-createdAt");
    //   }
    //   //pagination
    //   const page = parseInt(req.query.page, 10) || 1;
    //   const limit = parseInt(req.query.limit, 10) || 25;
    //   const skip = (page - 1) * limit;
    //   const endIndex = page * limit;
    //   const total = await bootcamps.countDocuments();

    //   query = query.skip(skip).limit(limit);

    //   //const bootcamp = await bootcamps.find();

    //   //executing query
    //   const bootcamp = await query;

    //   //pagination results
    //   const pagination = {};
    //   if (endIndex < total) {
    //     pagination.next = {
    //       page: page + 1,
    //       limit: limit
    //     };
    //   }
    //   if (skip > 0) {
    //     pagination.prev = {
    //       page: page - 1,
    //       limit
    //     };
    //   }
    //   console.log(pagination);
    res.status(200).json(res.advancedResults);
    // success: true,
    // count: bootcamp.length,
    // pagination,
    // data: bootcamp
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
    //Add user to req.body
    req.body.user = req.user.id;
    //check for published bootcamp
    const publishedBootcamp = await bootcamps.findOne({ user: req.user.id });
    //if the user is not an admin,they can only add one bootcamp
    //console.log(publishedBootcamp);
    if (publishedBootcamp && req.user.role !== "admin") {
      return next(
        new ErrorResponse(
          `the user with id ${req.user.id}has already published a bootcamp`,
          400
        )
      );
    }

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
    let bootcamp = await bootcamps.findById(req.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(`bootcamp not found with id of ${req.params.id}`, 404)
      );
    }
    //Make sure user is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role != "admin") {
      return next(
        new ErrorResponse(
          `User  ${req.params.id} is not authorized to update this bootcamp`,
          401
        )
      );
    }
    bootcamp = await bootcamps.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

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
      return next(
        new ErrorResponse(`bootcamp not found with id of ${req.params.id}`, 404)
      );
    }
    if (bootcamp.user.toString !== req.user.id && req.user.role !== "admin") {
      return next(
        new ErrorResponse(
          `User  ${req.params.id} is not authorized to delete this bootcamp`,
          401
        )
      );
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
//route PUT/api/v1/bootcamps/:id/photo
exports.bootcampPhotoUpload = async (req, res, next) => {
  try {
    const bootcamp = await bootcamps.findById(req.params.id);

    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }
    if (bootcamp.user.toString !== req.user.id && req.user.role !== "admin") {
      return next(
        new ErrorResponse(
          `User  ${req.params.id} is not authorized to upload photo in  this bootcamp`,
          401
        )
      );
    }

    if (!req.files) {
      return next(new ErrorResponse(`please upload a file`, 400));
    }
    //console.log(req.files.file);
    const file = req.files.file;
    //Make sure that image is a file
    if (!file.mimetype.startsWith("image")) {
      return next(new ErrorResponse(`please upload an image file`, 400));
    }
    //Check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
          400
        )
      );
    }
    //Create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
      if (err) {
        console.log(err);
        return next(new ErrorResponse(`problem with file upload `, 500));
      }
      await bootcamps.findByIdAndUpdate(req.params.id, { photo: file.name });
    });
    // console.log(file.name);
    res.status(200).json({
      success: true,
      data: file.name
    });
  } catch (err) {
    next(err);
  }
};
