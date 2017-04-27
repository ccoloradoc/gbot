'use strict';

var request = require('request');
var cheerio = require('cheerio');

module.exports = {
  clean: function(url) {
    var target = decodeURIComponent(url.replace('https://l.facebook.com/l.php?u=', ''));
    return target.substring(0, target.indexOf('&'));
  },
  extract: function(url, callback) {

    // It is already a GIF
    if(url.endsWith('.gif'))
      callback(url);

    //console.log(url);
    var options =  {
        encoding: null,
        method: 'GET',
        url: url
    }

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var $ = cheerio.load(body);
          var resource = 'uknown';

          $('meta').filter(function() {
              if($(this).attr('property') == 'og:url' && $(this).attr('content').endsWith('.gif')) {
                resource = $(this).attr('content');
                if(resource.includes('wallgif.com'))
                    resource = resource.replace('cdn.','media.');
              }
          });

          callback(resource);

        } else {
          callback(null);
        }
    });
  }
};
