'use strict';
var config = require('../config');
var MQService = require('../../modules/mqservice');

var mqservice = new MQService(config);

var Resource  = require('../models/resource');

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
      mqservice.fanout('resource_feed', {
        id: res._id,
        sender: payload.sender,
        resource: res.resource
      });
  });
});
