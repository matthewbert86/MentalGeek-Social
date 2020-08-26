const express = require('express');
// bring in express router
const router = express.Router();
// bring in auth middleware
const auth = require('../../middleware/auth');
// bring in express validator
const { check, validationResult } = require('express-validator');
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

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private

// We need to use auth and validation middleware, so we will put both in the brackets

router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Skills is required')
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Pull all the fields out
    const {
      company,
      location,
      website,
      bio,
      skills,
      status,
      githubusername,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
    } = req.body;

    // Build Profile Object
    const profileFields = {};
    // get user
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      // turn skills into an array
      // skills.split which turns a string into an array
      // skill.trim will ensure that any spacing in string wont affect array
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }

    console.log(profileFields.skills);

    res.send('Hello');
  }
);

module.exports = router;
