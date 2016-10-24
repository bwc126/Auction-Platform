'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Bid Schema
 */
var BidSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  auction: {
    type: Schema.ObjectId,
    ref: 'Auction'
  },
  amount: {
    type: Number,
    default: 1.00
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Bid', BidSchema);
