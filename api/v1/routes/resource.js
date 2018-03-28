

const express = require('express');
const router = express.Router();
const handler = require('../handlers/resource');

router.route('/videos/:file_id').get(function(req,res){
    handler.getVideoDetail(req,res);
});

router.route('/videos').get(function(req,res){

    handler.getVideoList(req,res);
});

module.exports = router;
