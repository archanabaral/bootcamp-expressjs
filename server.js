const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

//load env variables
dotenv.config({ path: "./config/config.env" });

//connect to database
connectDB();

//Route files
const bootcamps = require("./routes/bootcampsroute");
const courses = require("./routes/coursesroute");
const auth = require("./routes/auth");
const users = require("./routes/user");
const reviews = require("./routes/reviews");

const app = express();

//Body parser
app.use(express.json());

//cookie parser
app.use(cookieParser());

//FILE UPLODING
app.use(fileupload());

//Sanitize data
app.use(mongoSanitize());

//set security headers
app.use(helmet());

//prevent XSS attacks
app.use(xss()); //it prevent from inserting any script,html or anyother tags

//Rate Limiting it limit how much request user can send 100 req per minute
const limiter = rateLimit({
  windowMS: 10 * 60 * 100, //10 mins
  max: 100
});
app.use(limiter);

//prevent http param pollution
app.use(hpp());

//Enable cors 
app.use(cors());

//set static folder
app.use(express.static(path.join(__dirname, "public")));

//MOUNT ROUTERS
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses); //connecting '/api/v1/bootcamps' to bootcamps
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);
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
