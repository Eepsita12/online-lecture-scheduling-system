const User = require("../models/User");
const bcrypt = require("bcryptjs");

const createInstructor = async(req,res) => {
    try {
        const { name, email } = req.body;
        const password = await bcrypt.hash("instructor123",10);

        const instructor = await User.create({
            name,
            email,
            password,
            role: "instructor"
        });

        res.status(201).json({
            id: instructor._id,
            name: instructor.name,
            email: instructor.email,
            password: "instructor123" // optional: show once
        })

    } catch(err) {
        res.status(500).json({error: err.message})
    }
}

const getInstructors = async (req,res) => {
    const instructors = await User.find({role:"instructor"}).select("-password");
    res.json(instructors)
}

module.exports = {createInstructor, getInstructors};