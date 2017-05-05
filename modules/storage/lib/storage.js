var request = require('request');
var fs = require('fs');
var path = require('path');

class Storage {
  constructor(config) {
    try {
      if(!config || config.STORAGE_PATH === undefined) {
        throw Error("Unable to find storage path");
      } else {
        this.STORAGE_PATH = path.join(__dirname, config.STORAGE_PATH);
      }
    } catch(e) {
      console.log(e);
    }
  }

  store(source, destiny) {
    var ws = fs.createWriteStream(this.STORAGE_PATH + '/' + destiny);
    ws.on('error', function(err) { console.log(err); });
    request(source).pipe(ws);
  }
}


module.exports = Storage;
