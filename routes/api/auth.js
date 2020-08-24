const express = require('express');
// bring in express router
const router = express.Router();
// bring in middleware
const auth = require('../../middleware/auth');
// bring in User models
const User = require('../../models/User');

// @route    GET api/auth
// @desc     Test route
// @access   Public

// adding auth below will help keep this route protected
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
