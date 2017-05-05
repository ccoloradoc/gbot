var express = require('express');
var dateFormat = require('dateformat');
var router = express.Router();
var Resource  = require('../models/resource');
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
	Resource.find({ parsed: true }, function(err, resources) {
		var response = [];
    resources.forEach(function(resource) {
      console.log(resource._id + ' ' + resource.resource);
			response.push({
				id: resource._id,
				resource: resource.resource,
				created: dateFormat(resource.created_at, "dddd, mmmm dS, yyyy")
			});
    });

		res.render('index', {
	  		title: 'GBot',
				resources: response
			});

  });
});

router.get('/gif/:id', function(req, res, next) {
	Resource.findById(req.params.id, function(err, resource) {
    console.log(resource);

		res.render('resource', {
	  		title: 'GBot',
				resource: {
					id: resource._id,
					resource: resource.resource,
					created: dateFormat(resource.created_at, "dddd, mmmm dS, yyyy")
				}
			});

  });
});

router.get('/download/:id', function(req, res){
  var file = path(__dirname, '../../public/resource/' + req.params.id + '.gif');
  res.download(file); // Set disposition and send it.
});

module.exports = router;
