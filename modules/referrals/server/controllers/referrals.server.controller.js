'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Referral = mongoose.model('Referral'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an referral
 */
exports.create = function (req, res) {
  var referral = new Referral(req.body);
  referral.user_1 = req.user;
  referral.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(referral);
    }
  });
};

/**
 * Show the current referral
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var referral = req.referral ? req.referral.toJSON() : {};

  // Add a custom field to the Referral, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Referral model.
  referral.isCurrentUserOwner = req.user && referral.user_1 && referral.user_1._id.toString() === req.user_1._id.toString() ? true : false;

  res.json(referral);
};

/**
 * Update an referral
 */
exports.update = function (req, res) {
  var referral = req.referral;

  referral.user_2 = req.user;

  referral.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(referral);
    }
  });
};
/**
 * Delete an referral
 */
exports.delete = function (req, res) {
  var referral = req.referral;

  referral.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(referral);
    }
  });
};
