const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const {registerAdmin,login} = require("../controllers/authController");

const router = express.Router();
exports.router = router;

//Admin Register
router.post("/register", registerAdmin);

//Admin Login
router.post("/login", login);

module.exports= router;