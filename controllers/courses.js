const ErrorResponse = require("../utils/errorResponse");
const Course = require("../models/coursemodels");


//route api/v1/courses (this is gonna get all the courses)
//route GET/api/v1/bootcamps/:bootcampId/courses(this gets all the courses for the specific bootcamp)
exports.getCourses=async(req,res,next){
    try{
        
        const Courses=await Course.find()
        res.status(200).json({
            success:true,
            data:Courses
        })

    }catch(err){
        console.log(err);
    }
}