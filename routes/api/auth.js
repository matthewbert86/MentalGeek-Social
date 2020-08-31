const express = require('express');
// bring in express router
const router = express.Router();
// get bcrypt
const bcrypt = require('bcryptjs');
// get jwtsecret from config / default.json
const config = require('config');
// bring in jsonwebtoken
const jwt = require('jsonwebtoken');
// bring in validator
const { check, validationResult } = require('express-validator');
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

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
  '/',
  [
    check('email', 'Please use valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    // req.body is the object of data that will be sent to this route
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // destructure req.body
    const { email, password } = req.body;

    try {
      // See if user exists
      // findOne() takes in a field for how we want to search
      // we are searching by email
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      // check to make sure email and password match
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      // Return jsonwebtoken - so user can be logged in right away
      // create a payload
      const payload = {
        user: {
          id: user.id,
        },
      };
      // sign the token
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
