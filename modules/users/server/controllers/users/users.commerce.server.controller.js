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
  rp = require('request-promise');


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
// Use paypal to obtain a token for use with further requests.
exports.paypalTokenService = function(req,res) {
  // settings.url = 'https://api.sandbox.paypal.com/v1/oauth2/token';
  // settings.headers.Authorization = 'Basic QVoyR3FxcGNSZUFBSzZMUFY2TVpLN3lKYU9KQkRUeXotOWlnNnVmSU96dXBQQ3hsTmFzQWZHU19DSm8xZXBIM0gwdm9EX2hMVHBUekNWN2E6RU1JOFRtZ215WHpRb0dPWFpkVDJXUWltdnIyTkVjZUdCUnVsVldyTUEycVlFNFpYRm1xTllLN2hVckFxbndHODQ3UjBxYWhVdUY2Zmo0dDM=';
  // settings.headers['cache-control'] = 'no-cache';
  // settings.data.grant_type = 'client_credentials';
  var meta;
  var url = 'https://api.sandbox.paypal.com/v1/oauth2/token';
  var settings = {
    'async': true,
    'crossDomain': true,
    'url': 'https://api.sandbox.paypal.com/v1/oauth2/token',
    'method': 'POST',
    'headers': {
      'content-type': 'application/x-www-form-urlencoded',
      'authorization': 'Basic QVoyR3FxcGNSZUFBSzZMUFY2TVpLN3lKYU9KQkRUeXotOWlnNnVmSU96dXBQQ3hsTmFzQWZHU19DSm8xZXBIM0gwdm9EX2hMVHBUekNWN2E6RU1JOFRtZ215WHpRb0dPWFpkVDJXUWltdnIyTkVjZUdCUnVsVldyTUEycVlFNFpYRm1xTllLN2hVckFxbndHODQ3UjBxYWhVdUY2Zmo0dDM='
    },
    'body': 'grant_type=client_credentials'
  };
  rp(settings)
    .then(function(response) {
      res.json(response);
    })
    .catch(function(err) {
      res.json(err);
    });
};
// Use paypal to authorize payments.
exports.paypalPaymentAuth = function(req, res) {
  var amount = req.body.amount;
  var returnUrl = req.body.returnUrl;
  var cancelUrl = req.body.cancelUrl;
  var settings = {
    'method': 'POST',
    'body': {}
  };
  settings.body.intent = 'authorize';
  settings.body.payer = {
    'payment_method' : 'paypal'
  };
  settings.url = 'https://api.sandbox.paypal.com/v1/payments/payment';
  settings.body.transactions = [
    {
      'amount' : {
        'total' : amount,
        'currency' : 'USD',
        'details' : {
          'subtotal' : amount
        }
      },
      'description' : 'This is to authorize an amount of '+amount,
    }];
  settings.body.redirect_urls = {
    'return_url': returnUrl,
    'cancel_url': cancelUrl
  };
  settings.ignoreAuthModule = true;
  rp(settings)
    .then(function(response) {
      res.json(response);
    })
    .catch(function(err) {
      res.json(err);
    });
};
// Use paypal to capture payments.
exports.paypalPaymentCapture = function (req, res) {
  var amount = req.body.amount;
  var returnUrl = req.body.returnUrl;
  var cancelUrl = req.body.cancelUrl;
  var payerID = req.body.payerID;
  var auth = req.body.auth;
  var paymentID = req.body.paymentID;
  var settings = {
    'method': 'POST',
    'url' : 'https://api.sandbox.paypal.com/v1/payments/payment/'+paymentID+'/execute',
    'headers': {
      'authorization': auth,
      'Content-Type': 'application/json',
    },
    'body' : {
      'transactions': [{
        'amount': {
          'currency': 'USD',
          'total': user.bidTotal.toFixed(2)
        }
      }],
      'payer_id': payerID,
    }
  };
  settings.ignoreAuthModule = true;
};
