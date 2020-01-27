const path=require('path');
const express = require("express");
const dotenv = require("dotenv");
const fileupload=require('express-fileupload');
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

//load env variables
dotenv.config({ path: "./config/config.env" });

//connect to database
connectDB();

//Route files
const bootcamps = require("./routes/bootcampsroute");
const courses = require("./routes/coursesroute");

const app = express();
//Body parser
app.use(express.json());

//FILE UPLODING
app.use(fileupload());

//set static folder
app.use(express.static(path.join(__dirname,'public')));
//MOUNT ROUTERS
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses); //connecting '/api/v1/bootcamps' to bootcamps
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(`running environment is ${process.env.NODE_ENV}`)
);

//Handel unhandled promise rjection
//here unhandledRejection is event
process.on("unhandledRejection", (err, promise) => {
  console.log(`ERROR:${err.message}`);
  //close server and exit process

  server.close(() => process.exit(1));
});
