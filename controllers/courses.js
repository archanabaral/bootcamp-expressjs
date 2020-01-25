const ErrorResponse = require("../utils/errorResponse");
const Course = require("../models/coursemodels");
const Bootcamp=require('../models/bootcampmodels');

//route api/v1/courses (this is gonna get all the courses)
//route GET/api/v1/bootcamps/:bootcampId/courses(this gets all the courses for the specific bootcamp)
exports.getCourses = async (req, res, next) => {
  try {
    let query;
    if (req.params.bootcampId) {
      query = Course.find({ bootcamp: req.params.bootcampId }); //this means yedi maile query ma haneko id(i.e req.params.bootcampId) xai bootcamp ma already vako id sanga match vayo vane yo route GET/api/v1/bootcamps/:bootcampId/courses run hunxa
    } else {
      query = Course.find().populate({
        path:'bootcamp',
        select:'name description'
      });
    }
    const courses = await query;
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (err) {
    next(err);
    console.log(err);
  }
};
exports.getCourse=async(req,res,next)=>{
  try{
    const course=await Course.findById(req.params.id).populate({
      path:'bootcamp',
      select:'name description'
    });
    if(!course){
      return next(new ErrorResponse(`No course with id of ${req.params.id},404`));
    }
    res.status(200).json({
      success:true,
      data:course
    });


  }catch(err){
    console.log(err);
    next(err);
  }

};

//to create course 
//route POST/api/v1/bootcamps/:bootcampId/courses
exports.createCourse=async(req,res,next)=>{
  try{
    req.body.bootcamp=req.params.bootcampId;//here bootcamp is refering to bootcamp that is in courses model as field 

    const bootcamp=await Bootcamp.findById(req.params.bootcampId)
    if(!bootcamp){
      return next(new ErrorResponse(`No bootcamp with id of ${req.params.bootcampId},404`));
    }
    const course=await Course.create(req.body);
    res.status(200).json({
      success:true,
      data:course
    });


  }catch(err){
    console.log(err);
    next(err);
  }

};
