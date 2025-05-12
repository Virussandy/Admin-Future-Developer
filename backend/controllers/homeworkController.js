const Homework = require('../models/Homework');
const fs = require('fs');
const path = require('path');

exports.getHomeworkByClass = async (req, res) => {
  try {
    const classNumber = req.params.classNumber;
    const homeworkList = await Homework.find({ classNumber });
    res.json(homeworkList);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching homework' });
  }
};

exports.deleteHomework = async (req, res) => {
  try {
    const homework = await Homework.findById(req.params.id);

    if (!homework) {
      return res.status(404).json({ message: 'Homework not found' });
    }

    // Construct full file path
    const filePath = path.join(__dirname, '..', 'uploads', homework.file);

    // Delete file from uploads folder
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete homework from MongoDB
    await Homework.findByIdAndDelete(req.params.id);

    res.json({ message: 'Homework completely deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Error deleting homework' });
  }
};
