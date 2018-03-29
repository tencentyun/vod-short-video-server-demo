

const express = require('express');
const router = express.Router();
const handler = require('../handlers/misc');


router.get('/upload/signature', function(req, res) {
    handler.getUploadSignature(req,res);
});

module.exports = router;