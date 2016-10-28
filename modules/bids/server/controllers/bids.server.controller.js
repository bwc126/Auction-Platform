'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Bid = mongoose.model('Bid'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an bid
 */
exports.create = function (req, res) {
  var bid = new Bid(req.body);
  console.log(req.body.amount);
  bid.user = req.user;
  bid.auction = req.auction;
  bid.amount = Number(req.body.amount);
  bid.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bid);
    }
  });
};

/**
 * Show the current bid
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var bid = req.bid ? req.bid.toJSON() : {};

  // Add a custom field to the Bid, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Bid model.
  bid.isCurrentUserOwner = req.user && bid.user && bid.user._id.toString() === req.user._id.toString() ? true : false;

  res.json(bid);
};

/**
 * Update a bid
 */
exports.update = function (req, res) {
  var bid = req.bid;

  bid.bid = req.body.bid;
  bid.amount = req.body.amount;
  bid.user = req.body.user;



  bid.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bid);
    }
  });
};

/**
 * Delete an bid
 */
exports.delete = function (req, res) {
  var bid = req.bid;

  bid.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bid);
    }
  });
};

/**
 * List of Bids by Auction
 */
exports.listByAuction = function (req, res) {

  Bid.find({ auction: req.auction._id }).sort('-created').populate('user', 'displayName').exec(function (err, bids) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bids);
    }
  });
};
/**
 * List of Bids by User
 */
exports.listByUser = function (req, res) {

  Bid.find({ user: req.user._id }).sort('-created').exec(function (err, bids) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bids);
    }
  });
};
/**
  * Current gets the current bid by calculating from all bids placed
  */
exports.amount = function (req, res) {

  Bid.findOne({ auction: req.auction._id }).sort({ 'created' : -1 }).populate('user', 'displayName').exec(function (err, bids) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (!bids) {
        res.json(1.00);
      } else {
        res.json(bids.amount);
      }
    }
  });

};

/**
 * Bid middleware
 */
exports.bidByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Bid is invalid'
    });
  }

  Bid.findById(id).populate('user', 'displayName').exec(function (err, bid) {
    if (err) {
      return next(err);
    } else if (!bid) {
      return res.status(404).send({
        message: 'No bid with that identifier has been found'
      });
    }
    req.bid = bid;
    next();
  });
};
