const express = require('express');
// bring in express router
const router = express.Router();

// @route    GET api/profile/me
// @desc     Test route
// @access   Public
router.get('/', (req, res) => res.send('Profile route'));

module.exports = router;
