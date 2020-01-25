const fs =require('fs');
const mongoose=require('mongoose');
const dotenv=require('dotenv');

//load env variables
dotenv.config({path:'./config/config.env'});
//load models
const bootcamp=require('./models/bootcampmodels');
const Course=require('./models/coursemodels');
//connect to DB
mongoose.connect(process.env.MONGO_URI , {
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology:true
});
//Read JSON files
const bootcamps=JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'));//utf-8 is encoding type
const Courses=JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,'utf-8'));

//Import into db

const importData=async()=>{
    try{
        await bootcamp.create(bootcamps);//we dont have to save its result to any variable because we dont need to respond with anything just our goal isto save it to database
        await Course.create(Courses);
        console.log('Data imported');
        process.exit();

    }catch(err){
        console.log(err)

    }
}
//Delete data
const deleteData=async()=>{
    try{
        await bootcamp.deleteMany();
        await Course.deleteMany();
        console.log('Data destroyed');
        process.exit();

    }catch(err){

    }
}

if(process.argv[2]==='import'){
    importData();

}else if(process.argv[2]==='delete'){
    deleteData();
}
