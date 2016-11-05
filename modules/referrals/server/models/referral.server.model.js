'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Referral Schema
 * TODO: Implement Ref schema
 */

var ReferralSchema = new Schema({
  created : {
    type: Date,
    default: Date.now
  },
  accepted : {
    type: Date
  },
  user_1 : {
    type: Schema.ObjectId,
    ref: 'User'
  },
  user_2 : {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Referral', ReferralSchema);
