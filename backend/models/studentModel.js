// models/studentModel.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  classNumber: { type: Number, required: true },
  password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
