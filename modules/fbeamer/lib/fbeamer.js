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

  subscribe(site) {
    request({
      uri: 'https://graph.facebook.com/v2.6/me/subscribed_apps',
      qs: {
        access_token: this.ACCESS_TOKEN
      },
      method: 'POST'
    }, (error, response, body) => {
      if(!error && JSON.parse(body).success) {
        console.log('>> Page subscribed');
      } else {
        console.log(error);
      }
    });
  }

  whitelist(site) {
    request({
      uri: 'https://graph.facebook.com/v2.6/me/messenger_profile',
      qs: {
        access_token: this.ACCESS_TOKEN
      },
      body: {
        whitelisted_domains:[site]
      },
      json: true,
      method: 'POST'
    }, (error, response, body) => {
      if(!error && JSON.parse(body).success) {
        console.log('>> Site added to whitelist: ' + site);
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
          // if(msgEvent.message.attachments != undefined) {
          //   console.log(">>Attachments")
          //   console.log("   " + JSON.stringify(msgEvent.message.attachments));
          // }
          callback(msgObject);
        });
      });
    }
  }

  sendMessage(payload) {
    return new Promise((resolve, reject) => {
      request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
          access_token: this.ACCESS_TOKEN
        },
        method: 'POST',
        json: payload
      }, (error, response, body) => {
        if(!error && response.statusCode === 200) {
          resolve({
            messageId: body.message_id
          });
        } else {
          reject(response.body.error.message);
        }
      });
    });
  }

  txt(id, text) {
    let payload = {
      recipient: {
        id: id
      },
      message: {
        text: text
      }
    }

    this.sendMessage(payload)
      .catch(error => console.log(error));
  }

  img(id, url) {
    let payload = {
      recipient: {
        id: id
      },
      message:{
        attachment: {
          type:"image",
          payload:{
            url: url
          }
        }
      }
    }

    this.sendMessage(payload)
      .catch(error => console.log(error));
  }

  download(id, text, url) {
    let payload = {
      recipient: {
        id: id
      },
      message:{
        attachment:{
          type:'template',
          payload:{
            template_type:'button',
            text: text,
            buttons:[{
                type: 'web_url',
                url:url,
                title:'Download',
                webview_height_ratio: 'compact'
            }]
          }
        }
      }
    }

    this.sendMessage(payload)
      .catch(error => console.log(error));
  }

  document(id, url) {
    let payload = {
      recipient: {
        id: id
      },
      message:{
        attachment:{
          type:'file',
          payload:{
              url:url
          }
        }
      }
    };

    this.sendMessage(payload)
      .catch(error => console.log(error));
  }
}

module.exports = FBeamer;
