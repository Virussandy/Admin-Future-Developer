const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const { registerUser, loginUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);

// router.get('/user',authMiddleware, async (req, res) => {
//   res.json({ email: req.user.email });
// });
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('username email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ username: user.username, email: user.email });
  } catch (err) {
    console.error('Error in /user route:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = router;
