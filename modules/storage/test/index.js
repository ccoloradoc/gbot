var Storage = require('../lib/storage');

var storage = new Storage({STORAGE_PATH: '../test/resource'});

storage.store('https://media3.giphy.com/media/J6x4w7Mke5hcs/giphy.gif', '123456789.gif');
