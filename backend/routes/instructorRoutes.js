const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {createInstructor, getInstructors} = require("../controllers/instructorController")

const router = express.Router();

//Add instructor (admin)
router.post("/", protect, adminOnly, createInstructor)

//get all instrcutors
router.get("/", protect, adminOnly, getInstructors)


module.exports= router;