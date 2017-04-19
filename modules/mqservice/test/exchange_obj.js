var colors = require('colors');
var config = require('../../../app/config');
var MQService = require('../../mqservice');

var mqservice = new MQService(config);
var ex = 'resolved';
var i = 0;

setInterval(function() {
  var payload = {id: i++, message: 'Ping'};
  mqservice.fanout(ex, payload);
  var msg = "> Sent : [" + JSON.stringify(payload) + "]";
  console.log(msg.green);
}, 1000);

mqservice.exchange(ex, function(payload, ack) {
  var msg = " < Consumer #1 [" + JSON.stringify(payload) + "]";
  console.log(msg.cyan);
});

mqservice.exchange(ex, function(payload, ack) {
  var msg = " < Consumer #2 [" + JSON.stringify(payload) + "]";
  console.log(msg.yellow);
});
