const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: ["true", "must add a course title"]
  },
  description: {
    type: String,
    required: ["true", "must require description"]
  },
  weeks: {
    type: String,
    required: ["true", "must add number of weeks"]
  },
  tuition: {
    type: String,
    required: ["true", "must add a tution cost"]
  },
  minimumSkill: {
    type: String,
    required: ["true", "must add a minimum skills"],
    enum: ["beginner", "intermediate", "advanced"]
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true
  }
});
module.exports = mongoose.model("Course", courseSchema);
