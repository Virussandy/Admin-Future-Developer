// backend/routes/homeworkRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/authMiddleware');
const verifyToken = require('../middleware/verifyToken');
const Homework = require('../models/Homework');

//  Import the controller functions
const {
  getHomeworkByClass,
  deleteHomework
} = require('../controllers/homeworkController');

// Multer configuration
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

//  Upload homework
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  const homework = new Homework({
    classNumber: req.body.className,
    file: req.file.filename,
  });
  await homework.save();
  res.json({ message: 'Homework uploaded' });
});

//  Get homework by class
router.get('/by-class/:classNumber', verifyToken, getHomeworkByClass);

//  Delete homework by ID
router.delete('/:id', verifyToken, deleteHomework);

module.exports = router;
