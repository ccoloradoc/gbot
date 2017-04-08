var express = require('express');
var router = express.Router();
var models  = require('../models');

var config = require('../config')
var FBeamer = require('../../modules/fbeamer');
var f = new FBeamer(config);

f.subscribe();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('/api');
	f.registerHook(req, res);
  //return next();
});

router.post('/', (req, res, next) => {
  f.incoming(req, res, msg => {
    console.log(msg);
  });
  res.status(200).end();
  //return next();
});

module.exports = router;
