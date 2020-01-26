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
    type: Number,
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
courseSchema.statics.getAverageCost = async function(bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" }
      }
    }
  ]);
  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10
    });
  } catch (err) {
    console.log(err);
  }
};
courseSchema.post("save", function() {
  this.constructor.getAverageCost(this.bootcamp);
});
courseSchema.pre("remove", function() {
  this.constructor.getAverageCost(this.bootcamp);
});
module.exports = mongoose.model("Course", courseSchema);
