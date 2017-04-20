'use strict';
var config = require('../config');
var mongoose = require('mongoose');

mongoose.connect(config.MONGO_DB);
mongoose.Promise = require('bluebird');

var Schema = mongoose.Schema;

// create a schema
var resourceSchema = new Schema({
  source: { type: String, required: true, unique: true },
  resource: String,
  parsed: Boolean,
  created_at: Date,
  updated_at: Date
});

// on every save, add the date
resourceSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

// the schema is useless so far
// we need to create a model using it
var Resource = mongoose.model('Resource', resourceSchema);

// make this available to our users in our Node applications
module.exports = Resource;
