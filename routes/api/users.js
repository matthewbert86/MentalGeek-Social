const express = require('express');
// bring in express router
const router = express.Router();
// gravatar
const gravatar = require('gravatar');
// bring in bcrypt
const bcrypt = require('bcryptjs');
// bring in validator
const { check, validationResult } = require('express-validator');
// bring in user model
const User = require('../../models/User');

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  '/',
  [
    // Use express validation to check for a name
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please use valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    // req.body is the object of data that will be sent to this route
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // destructure req.body
    const { name, email, password } = req.body;

    try {
      // See if user exists
      // findOne() takes in a field for how we want to search
      // we are searching by email
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      // Get users gravatar
      // We need to pass user email into a method to get URL of gravatar
      const avatar = gravatar.url(email, {
        // size
        s: '200',
        // rating
        r: 'pg',
        // default user icon if user has no gravatar
        d: 'mm',
      });

      // create instance of a user
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // Encrypt password
      // create salt to do hashing, which safeguards passwords
      const salt = await bcrypt.genSalt(10);
      // take password and hash it
      user.password = await bcrypt.hash(password, salt);
      // save user to database
      await user.save();

      // Return jsonwebtoken - so user can be logged in right away
      res.send('User registered');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
