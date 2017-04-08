'use strict';
var request = require('request');

class FBeamer {
  constructor(config) {
    try {
      if(!config || config.ACCESS_TOKEN === undefined || config.VERIFY_TOKEN === undefined ) {
        throw Error("Unable to access tokens");
      } else {
        this.ACCESS_TOKEN = config.ACCESS_TOKEN;
        this.VERIFY_TOKEN = config.VERIFY_TOKEN;
      }
    } catch(e) {
      console.log(e);
    }
  }

  subscribe() {
    request({
      uri: 'https://graph.facebook.com/v2.6/me/subscribed_apps',
      qs: {
        access_token: this.ACCESS_TOKEN
      },
      method: 'POST'
    }, (error, response, body) => {
      if(!error && JSON.parse(body).success) {
        console.log('Susbscribed to the page!!!');
      } else {
        console.log(error);
      }
    });
  }

  registerHook(req, res) {
    var mode = req.query['hub.mode'];
    var verify_token = req.query['hub.verify_token'];
    var challenge = req.query['hub.challenge'];

    console.log(mode);
    console.log(verify_token);

    if(mode === 'subscribe' && verify_token === this.VERIFY_TOKEN) {
      return res.end(challenge);
    } else {
      console.log('Could not subscribe hook');
      return res.status(403).end();
    }
  }

  incoming(req, res, callback) {
    let data = req.body;
    if(data.object === 'page') {
      data.entry.forEach(pageObj => {
        pageObj.messaging.forEach(msgEvent => {
          let msgObject = {
            sender: msgEvent.sender.id,
            timeOfMessage: msgEvent.timestamp,
            message: msgEvent.message
          };

          if(msgEvent.message.attachments != undefined) {
            console.log(JSON.stringify(msgEvent.message.attachments));
          }

          callback(msgObject);
        });
      });
    }
  }
}

module.exports = FBeamer;
