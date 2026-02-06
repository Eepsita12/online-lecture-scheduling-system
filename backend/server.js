const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();


const app = express();
const PORT = process.env.PORT || 4000

app.use(cors({
  origin: [
    'https://online-lecture-scheduling-system.vercel.app',      // ← NEW URL (without -de)
    'https://online-lecture-scheduling-system-de.vercel.app',   // ← OLD URL
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

app.use(express.json())

mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err.message));

app.get("/",(req,res)=> {
    res.send("API running");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/instructors", require("./routes/instructorRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/lectures", require("./routes/lectureRoutes"));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

