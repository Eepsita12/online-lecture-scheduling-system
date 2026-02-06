const express = require("express");
const {createLecture, getMyLectures, getLectures} = require("../controllers/lectureController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();
exports.router = router;

//Assign Lecture
router.post("/", protect, adminOnly, createLecture);

router.get("/", protect, adminOnly, getLectures);    

router.get("/my", protect, getMyLectures);           

module.exports= router;