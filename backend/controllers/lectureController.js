const Lecture = require("../models/Lecture");

const createLecture = async (req,res) => {
    try{

        const lecture = await Lecture.create(req.body);
        res.status(201).json(lecture)

    } catch (err) {
        if(err.code === 11000) {                //11000 is MongoDB's error code for duplicate key error
            return res.status(400).json({ message: "Instructor already has a lecture on this date" });
        }

        res.status(500).json({error: err.message})
    }
}

const getMyLectures = async (req,res) => {
    const lectures = await Lecture.find({instructor: req.user.id})
    .populate("course","name");

    res.json(lectures);
}

const getLectures = async (req, res) => {
  try {
    // Fetch all lectures with populated course and instructor info
    const lectures = await Lecture.find()
      .populate("course", "name")
      .populate("instructor", "name");

    res.json(lectures);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {createLecture, getMyLectures, getLectures};