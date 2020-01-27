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
  phone: {
    type: String,
    maxlength: [20, 'Phone number can not be longer than 20 characters']
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
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
},{
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
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

//if we delete bootcamp all of the cascaded courses also be deleted
BootcampSchema.pre('remove',async function(next){
  console.log(`courses being removed from bootcamp ${this._id}`)
   await this.model('Course').deleteMany({bootcamp:this._id})// (to make sure that we only delete courses that are the part of the bootcamp being removed so  we do bootcamp:this._id since in course model bootcamp is of type objectId (yedi maile haleko id course document ma vako bootcamp id sanga match vayo vane tyo specific course pani delete hunxa))
   next();
});



//Reverse populate wirh virtuals
BootcampSchema.virtual('courses',{
  ref:'Course',
  localField:'_id',
  foreignField:'bootcamp',
  justOne:false
});//1st arugmrnt is the field we want to add as virtual 2nd argument consists of several options like localfield of courses foreignfield in courses
module.exports = mongoose.model("Bootcamp", BootcampSchema);
