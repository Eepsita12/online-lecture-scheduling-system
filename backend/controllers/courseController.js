const Course = require("../models/Course")

const createCourse = async(req,res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json(course);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
}

const getCourses = async(req,res) => {
    const courses = await Course.find();
    res.json(courses);
}

module.exports={createCourse, getCourses}