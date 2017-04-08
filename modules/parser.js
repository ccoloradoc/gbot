var request = require('request');
var cheerio = require('cheerio');

module.exports = {
  extract: function(url, callback) {
    //console.log(url);
    var options =  {
        encoding: null,
        method: 'GET',
        url: url
    }

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var $ = cheerio.load(body);

          $('img').filter(function() {
              var uri = '';
              if(options.url.includes('wallgif.com') || options.url.includes('giphy.com/go')) {
                uri = $(this).attr('data-gif');
              } else if(options.url.includes('gifsnation.com')) {
                uri = $(this).attr('src');
              } else {
                uri = $(this).attr('src');
                if(uri.includes('http://www.phygee.com/') && !uri.includes('files/profile/')) {
                  uri = '';
                }
              }

              if(uri != undefined && uri.startsWith('http') && uri.endsWith('.gif')) {
                callback(uri);
              }
          });

          $('.fullgiflogo').filter(function() {
            var uri = $(this).attr('onclick').replace('fullface(\'','').replace('\')','');
            callback(uri);
          });

        } else {
          callback(null);
        }
    });
  }
};
