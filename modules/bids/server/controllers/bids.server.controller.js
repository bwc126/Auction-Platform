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

// var getAmount = function(auction) {
//   Bid.findOne({ auction: auction._id }).sort({ 'created' : -1 }).exec(function (err, bids) {
//     if (err) {
//       return status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     } else {
//       if (!bids) {
//         console.log('no bids found', 'line 21');
//         return 1.00;
//       } else {
//         console.log('bid found', 'line 24');
//         return bids.amount;
//       }
//     }
//   });
//
// };
/**
 * Create an bid
 */
exports.create = function (req, res) {
  var bid = new Bid(req.body);
  var BID_INCREMENT = 1.01;
  bid.user = req.user;
  bid.auction = req.auction;
  // bid.amount = Math.max(Number(req.body.amount),getAmount(req.auction));
  // This is an instantiation of mongoose's save function for the bid schema, in a form that we can use easily above.
  var save = function() {
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
  // We need to find the current leading bid amount before we can save a new one
  Bid.findOne({ auction: req.auction._id }).sort({ 'created' : -1 }).exec(function (err, bids) {
    if (err) {
      return status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // Now that we found the bid, or not, we can set the bid amount based on the old one, after incrementing by our bid increment. Then, we call mongoose's save function for the bid.
      if (!bids) {
        bid.amount = 1.00;
        save();
      } else {
        bid.amount = bids.amount * BID_INCREMENT;
        save();
      }
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

  Bid.findOne({ auction: req.auction._id }).sort({ 'created' : -1 }).populate('user', 'displayName').exec(function (err, bid) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (!bid) {
        res.json(1.00);
      } else {
        res.json(bid.amount);
      }
    }
  });

};
/**
  * Leading gets the leading bid for an auction.
  */
exports.leading = function (req, res) {

  Bid.findOne({ auction: req.auction._id }).sort({ 'created' : -1 }).populate('user', 'displayName').exec(function (err, bid) {
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
