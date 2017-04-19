var colors = require('colors');
var config = require('../../../app/config');
var MQService = require('../../mqservice');

var mqservice = new MQService(config);
var queue = 'task_1';
var i = 0;

setInterval(function() {
  var payload = { id: i++, message: 'Ping' };

  mqservice.send(queue, payload, function(payload) {
    var msg = "> Payload [" + JSON.stringify(payload) + "]";
    console.log(msg.green);
  });
}, 1000);

mqservice.subscribe(queue, function(payload, ack) {
  var msg = " < Consumer #1 [" + JSON.stringify(payload) + "]";
  console.log(msg.yellow);
  ack();
});

mqservice.subscribe(queue, function(payload, ack) {
  var msg = " < Consumer #2 [" + JSON.stringify(payload) + "]";
  console.log(msg.cyan);
  ack();
});
