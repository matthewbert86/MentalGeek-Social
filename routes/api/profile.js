const express = require('express');
// bring in express router
const router = express.Router();
// bring in auth middleware
const auth = require('../../middleware/auth');
// bring in profile model
const Profile = require('../../models/Profile');
// bring in user model
const User = require('../../models/User');

// @route    GET api/profile/me - this endpoint for individual user profile
// @desc     Test route
// @access   Private
router.get('/me', auth, async (req, res) => {
  try {
    // use Profile.findOne to find individual user
    // we will use Populate to bring in the name and avatar of user, which are in User.js model
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);
    // check to see if there is no profile
    if (!profile) {
      return res
        .status(400)
        .json({ msg: 'There is no profile for this user.' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
