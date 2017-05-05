'use strict';
var config = require('../config');
var MQService = require('../../modules/mqservice');
var Storage = require('../../modules/storage');

var mqservice = new MQService(config);

var Resource  = require('../models/resource');

var storage = new Storage(config);

mqservice.exchange('gif_feed', function(payload) {
  console.log('>> Request: ' + payload.resource);
  var resource = new Resource({
    resource: payload.resource,
    source: payload.source,
    parsed: true
  });

  resource.save().then(function(res) {
      console.log('>> Resource saved correctly');
      console.log(`  ${res._id} = ${res.resource}`);

      storage.store(res.resource, res._id + '.gif');

      mqservice.fanout('resource_feed', {
        id: res._id,
        sender: payload.sender,
        resource: res.resource
      });
  });
});
