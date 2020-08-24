const express = require('express');
// bring in express router
const router = express.Router();

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
  (req, res) => {
    // req.body is the object of data that will be sent to this route
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    res.send('User route');
  }
);

module.exports = router;
