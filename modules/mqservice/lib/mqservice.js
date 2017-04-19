'use strict';

var amqp = require('amqplib/callback_api');

class MQService {
  constructor(config) {
    try {
      if(!config || config.MQ_URL === undefined) {
        throw Error("Unable to access MQ Service url");
      } else {
        this.MQ_URL = config.MQ_URL;
      }
    } catch(e) {
      console.log(e);
    }
  }

  connect(fnc, close) {
    amqp.connect(this.MQ_URL + "?heartbeat=60", function(err, conn) {
      conn.createChannel(fnc);
      if(close)
        setTimeout(function() { conn.close(); }, 500);
    });
  }

  send(task, payload, callback) {
    this.connect(function(err, ch) {
      ch.assertQueue(task, {durable: true});
      ch.sendToQueue(task, new Buffer(JSON.stringify(payload)), {persistent: true});
      callback(payload);
    }, true);
  }

  subscribe(task, callback) {
    this.connect(function(err, ch) {
      ch.assertQueue(task, {durable: true});
      ch.prefetch(1);
      ch.consume(task, function(payload) {
        callback(JSON.parse(payload.content.toString()), function() {
          ch.ack(payload);
        });
      }, {noAck: false});
    }, false);
  }

  fanout(ex, payload) {
    this.connect(function(err, ch) {
      ch.assertExchange(ex, 'fanout', {durable: false});
      ch.publish(ex, '', new Buffer(JSON.stringify(payload)));
    }, true);
  }

  exchange(ex, callback) {
    this.connect(function(err, ch) {
      ch.assertExchange(ex, 'fanout', {durable: false});

      ch.assertQueue('', {exclusive: true}, function(err, q) {
        ch.bindQueue(q.queue, ex, '');

        ch.consume(q.queue, function(payload) {
          callback(JSON.parse(payload.content.toString()));
        }, {noAck: true});
      });
    }, false);
  }
}

module.exports = MQService;
