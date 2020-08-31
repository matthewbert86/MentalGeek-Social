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
      check('bio', 'Bio is required')
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
      location,
      website,
      bio,
      hobbies,
      youtube,
      twitter,
      instagram,
      facebook,
    } = req.body;

    // Build Profile Object
    const profileFields = {};
    // get user
    profileFields.user = req.user.id;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (hobbies) profileFields.hobbies = hobbies;

    // Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;

    // Update and instert data in the fields
    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        // return entire profile if its found
        return res.json(profile);
      }

      // Create profile if no profile is found
      profile = new Profile(profileFields);
      // save profile
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) return res.status(400).json({ msg: 'Profile not found' });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete('/', auth, async (req, res) => {
  try {
    // @todo - remove users posts

    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private
router.put(
  '/hobbies',
  [
    auth,
    [
      check('title', 'Title is required')
        .not()
        .isEmpty(),
      check('description', 'description is required')
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get body data
    const { title, description } = req.body;

    // creates an object with data that user submits
    const newExp = {
      title,
      description,
    };

    // mongoDB
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      // unshift makes sure that most recent additions are first
      profile.hobbies.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (error) {
      console.err(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete profile experience
// @access   Private
router.delete('/hobbies/:exp_id', auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });

    foundProfile.hobbies = foundProfile.hobbies.filter(
      (exp) => exp._id.toString() !== req.params.exp_id
    );

    await foundProfile.save();
    return res.status(200).json(foundProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
