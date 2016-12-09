'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Auction Schema
 */
var AuctionSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  auctionImageURL: {
    type: String,
    default: 'modules/auctions/client/img/default.png'
  },
  amount: {
    type: Number,
    default: 1.00
  },
  weekActive: {
    type: Date
  }
});

mongoose.model('Auction', AuctionSchema);
