const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required:true
        },
        date: {
            type: Date,
            required:true
        },
    }, {timestamps:true}
);

//prevents assignment of instructors to diff lectures on the same date
lectureSchema.index(
    {instructor: 1, date: 1},
    {unique:true}
)

module.exports = mongoose.model("Lecture",lectureSchema);