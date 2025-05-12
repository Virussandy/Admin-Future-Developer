// routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const { getAllStudents, deleteStudent } = require("../controllers/studentController");

// Fetch all students
router.get("/all", getAllStudents);

// Delete a student by ID
router.delete("/delete/:id", deleteStudent);

module.exports = router;
