
//way of defaining function inside function
const asyncHandler=fn=>(req,res,next)=>{
    Promise.resolve(fn(req,res,next)).catch(next);

}
module.exports=asyncHandler;