const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();


const app = express();
const PORT = process.env.PORT || 4000

app.use(cors({
  origin: [
    'https://your-vercel-https://online-lecture-scheduling-system-de.vercel.app/.vercel.app',  
    'http://localhost:4000'  
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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

