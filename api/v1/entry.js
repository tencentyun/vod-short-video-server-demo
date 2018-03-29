const express = require('express');
const router = express.Router();

router.use('/misc', require('./routes/misc'));
router.use('/resource', require('./routes/resource'));


module.exports = router;