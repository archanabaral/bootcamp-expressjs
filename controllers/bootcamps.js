
const ErrorResponse=require('../utils/errorResponse');

const bootcamps = require("../models/bootcampmodels");

exports.getBootcamps = async(req, res, next) => {
    try{
        const bootcamp=await bootcamps.find();
  res.status(200).json({
    success: true,
    count:bootcamp.length,
    data:bootcamp
  });
}catch (err) {
    res.status(400).json({
      success: false,
      message: err
    });
}
}
exports.getBootcamp = async (req, res, next) => {
    try{
        const bootcamp=await bootcamps.findById(req.params.id);
        if(!bootcamp){
            return next(new ErrorResponse(`bootcamp of this id  ${req.params.id} is not available`,404));
        }
  res.status(200).json({
    success: true,
    data:bootcamp
  });
 
}catch (err) {
    // res.status(400).json({
    //   success: false,
    //   message: err
    // });
    next(new ErrorResponse(`bootcamp not found with id of ${req.params.id}`,404));
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
    if(!bootcamp){
        return res.status(400).json({success:false});
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

    if(!bootcamp){
        return res.status(400).json({success:false});
    }

    res.status(200).json({
      success: true,
      data:{}
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err
    });
  }
};
