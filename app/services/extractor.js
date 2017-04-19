
var config = require('../config');
var MQService = require('../../modules/mqservice');
var parser = require('../../modules/parser');

var mqservice = new MQService(config);

//Susbcribe to page url feed
mqservice.subscribe('page_feed', function(payload, ack) {
  console.log('[x] Income extract request ');
  // Clean page url
  var url = parser.clean(payload.source);
  console.log(' s: ' + url);
  // Extract gif url from page
  parser.extract(url, function(gif) {
    console.log(' r: ' + gif);
    payload.resource = gif;
    //Sending gif back
    mqservice.fanout('gif_feed', payload);
    ack();
  });
});
