var express = require('express');
var router = express.Router();
var models  = require('../models');

var parser = require('../../modules/parser');

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
    if(msg.message.attachments != undefined) {
        var url = parser.clean(msg.message.attachments[0].url);
        console.log(url);
        parser.extract(url, function(gif) {
          console.log('> ' + gif);
          //f.img(msg.sender, gif);
          //f.txt(msg.sender, `That is a funny gif, here you have the direct link ${gif}`);
          f.download(msg.sender, 'That is a funny gif, you can download it here!', gif)
        });
    }
  });
  res.status(200).end();
  //return next();
});

module.exports = router;
