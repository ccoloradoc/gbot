'use strict';

if(process.env.NODE_ENV === 'production') {
  module.exports = {
    ACCESS_TOKEN: process.env.ACCESS_TOKEN,
    VERIFY_TOKEN: process.env.VERIFY_TOKEN
  };
} else {
  module.exports = require('./development.json');
}
