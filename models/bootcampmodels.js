const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");
const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    requires: [true, "must add a name"],
    unique: true,
    trim: true,
    maxlength: [50, "Name cannot be more than 50 characters"]
  },
  slug: String, //it is needed suppose name:Bootcamp Archu then slug will be in lowercase like bootcamp-archu because it will be in url i.e now we can search as /api/v1/bootcamps/bootcamp-archu
  description: {
    type: String,
    requires: [true, "must add a description"],
    maxlength: [500, "Name cannot be more than 500 characters"]
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Please use a valid URL with HTTP or HTTPS"
    ]
  },

  address: {
    type: String,
    required: [true, "please add address"]
  },
  location: {
    //type is gonna be GeoJSON point
    type: {
      type: String,
      enum: ["point"]
      // required:true
    },
    coordinates: {
      type: [Number],
      // required:true,
      index: "2dsphere"
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },
  careers: {
    // Array of strings
    type: [String],
    required: true,
    enum: [
      "Web Development",
      "Mobile Development",
      "UI/UX",
      "Data Science",
      "Business",
      "Other"
    ]
  },
  averageRating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [10, "Rating must can not be more than 10"]
  },
  averageCost: Number,
  photo: {
    type: String,
    default: "no-photo.jpg"
  },
  housing: {
    type: Boolean,
    default: false
  },
  jobAssistance: {
    type: Boolean,
    default: false
  },
  jobGuarantee: {
    type: Boolean,
    default: false
  },
  acceptGi: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
//create bootcamp slug from the name
BootcampSchema.pre("save", function(next) {
  this.slug = slugify(this.name, { lower: true }); //referring to slug field we have in this document or schema
  next();
});
//Geocode and create location field
BootcampSchema.pre("save", async function(next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipCode,
    country: loc[0].countryCode
  };
  //Do not save address in DataBase

  this.address = undefined;
  next();
});

module.exports = mongoose.model("Bootcamp", BootcampSchema);
