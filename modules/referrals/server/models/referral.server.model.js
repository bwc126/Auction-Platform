'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Referral Schema
 */
var ReferralSchema = new Schema({
  created : {},
  accepted : {},
  user_1 : {},
  user_2 : {}
})

mongoose.model('Referral', ReferralSchema);
