const express = require('express');
// bring in express router
const router = express.Router();

// @route    GET api/users
// @desc     Test route
// @access   Public
router.get('/', (req, res) => res.send('User route'));

module.exports = router;
