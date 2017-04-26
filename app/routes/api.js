var express = require('express');
var router = express.Router();

var config = require('../config')
var FBeamer = require('../../modules/fbeamer');
var f = new FBeamer(config);

var MQService = require('../../modules/mqservice');
var mqservice = new MQService(config);

f.subscribe();

/*
 *  Register facebook hook
 */
router.get('/', function(req, res, next) {
  console.log('/api');
	f.registerHook(req, res);
  //return next();
});

/*
 *  Process facebook message
 */
router.post('/', (req, res, next) => {
  // Parse facebook incoming message
  f.incoming(req, res, msg => {
    // Message has attachment
    if(msg.message.attachments != undefined) {
        var payload = {
          sender: msg.sender,
          source: msg.message.attachments[0].url
        };
        console.log('[x] Requesting resource:'  + msg.message.attachments[0].url);

        mqservice.send('page_feed', payload, function(payload){
          console.log(' >> Sent : ' + payload.source);
          f.txt(payload.sender, 'That is a funny gif, let me find the url for you...');
        });
    }
  });
  res.status(200).end();
});

/*
 * Monitor GIF parse resolve
*/
mqservice.exchange('gif_feed', function(payload) {
  console.log(' <<' + payload.resource);
  f.text(payload.sender, 'I got it! You can download the GIF here:');
  f.document(payload.sender, payload.resource);
});

module.exports = router;
