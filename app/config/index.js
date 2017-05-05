'use strict';

if(process.env.NODE_ENV === 'production') {
  module.exports = {
    ACCESS_TOKEN: process.env.ACCESS_TOKEN,
    VERIFY_TOKEN: process.env.VERIFY_TOKEN,
    MONGO_DB: process.env.MONGO_DB,
    MQ_URL: process.env.MQ_URL,
    STORAGE_PATH: process.env.STORAGE_PATH
  };
} else {
  module.exports = require('./development.json');
}
