const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {createCourse, getCourses}= require("../controllers/courseController")

const router = express.Router();

// Add a course
router.post("/", protect, adminOnly, createCourse)

// Get all courses
router.get("/", protect, getCourses)

module.exports = router;
