'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  User = mongoose.model('User'),
  auctions = require(path.resolve('./modules/auctions/server/controllers/auctions.server.controller')),
  bids = require(path.resolve('./modules/bids/server/controllers/bids.server.controller')),
  fetchUrl = require('fetch').fetchUrl;


/**
* Update the User's total of valid bids
*/
exports.updateUserTotal = function (req, res) {
  var user = req.user;
  var total = 0;
  console.log('UPDATE USER TOTAL: ',req.bids, req.user);
  var numBids = req.bids.length;

  for (var i = 0; i < numBids; i++) {
    total += req.bids[i].amount;
  }
  user.bidTotal = total;
  // get all the auctions, loop through them
  // get the leading bids, add their amounts to bidTotal;

  user.save(function (saveError) {
    if (saveError) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(saveError)
      });
    } else {
      req.login(user, function (err) {
        if (err) {
          res.status = err;
        } else {
          res.user = user;
        }
      });
    }
  });
};

exports.authorizePayment = function (req, res) {
  console.log('authorizing payment with paypal . . . ' + req.body.amount);
};

/**
 * Update the user's referral multiplier
 */

exports.updateMultiplier = function (req, res) {
  // Update the user's multiplier and save it.
  console.log('updateMultipler called');
  var user1 = req.referral.user_1;
  var referralee = req.referral.user_2;
  if (user1 !== referralee) {
    User.findById(user1).exec(function(err, user) {
      user.referrals+=1;
      user.save(function (saveError) {
        if (saveError) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(saveError)
          });
        } else {
          req.login(user, function (err) {
            if (err) {
              res.status = err;
            } else {
              res.user = user;
            }
          });
        }
      });
    });
  }
};
exports.paypalTokenService = function(req,res) {
  // settings.url = 'https://api.sandbox.paypal.com/v1/oauth2/token';
  // settings.headers.Authorization = 'Basic QVoyR3FxcGNSZUFBSzZMUFY2TVpLN3lKYU9KQkRUeXotOWlnNnVmSU96dXBQQ3hsTmFzQWZHU19DSm8xZXBIM0gwdm9EX2hMVHBUekNWN2E6RU1JOFRtZ215WHpRb0dPWFpkVDJXUWltdnIyTkVjZUdCUnVsVldyTUEycVlFNFpYRm1xTllLN2hVckFxbndHODQ3UjBxYWhVdUY2Zmo0dDM=';
  // settings.headers['cache-control'] = 'no-cache';
  // settings.data.grant_type = 'client_credentials';
  var meta;
  var url = 'https://api.sandbox.paypal.com/v1/oauth2/token';
  var settings = {
    'url': 'https://api.sandbox.paypal.com/v1/oauth2/token',
    'async': true,
    'crossDomain': true,
    'method': 'POST',
    'headers': {
      'content-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json, text/plain, */*',
      'authorization': 'Basic QVoyR3FxcGNSZUFBSzZMUFY2TVpLN3lKYU9KQkRUeXotOWlnNnVmSU96dXBQQ3hsTmFzQWZHU19DSm8xZXBIM0gwdm9EX2hMVHBUekNWN2E6RU1JOFRtZ215WHpRb0dPWFpkVDJXUWltdnIyTkVjZUdCUnVsVldyTUEycVlFNFpYRm1xTllLN2hVckFxbndHODQ3UjBxYWhVdUY2Zmo0dDM=',
      'cache-control': 'no-cache',
      'postman-token': 'bf5aa707-66c2-92f0-3c0e-af24e992b841'
    },
    'data': 'grant_type=client_credentials',
    'ignoreAuthModule': 'true'
  };
  fetchUrl(url, settings, function(error, meta, body) {
    // console.log(error);
    console.log(meta);
    meta = meta;
    // console.log(body);
  });
  res.json(meta);
};
