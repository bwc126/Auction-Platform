'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Auction = mongoose.model('Auction'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


/**
 * Create an auction
 */
exports.create = function (req, res) {
  var auction = new Auction(req.body);
  auction.user = req.user;
  auction.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(auction);
    }
  });
};

/**
 * Show the current auction
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var auction = req.auction ? req.auction.toJSON() : {};

  // Add a custom field to the Auction, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Auction model.
  auction.isCurrentUserOwner = req.user && auction.user && auction.user._id.toString() === req.user._id.toString() ? true : false;

  res.json(auction);
};

/**
 * Update an auction
 */
exports.update = function (req, res) {
  var auction = req.auction;

  auction.title = req.body.title;
  auction.content = req.body.content;
  auction.auctionImageURL = req.body.auctionImageURL;
  auction.advertiser = req.body.advertiser;



  auction.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(auction);
    }
  });
};
/**
 * TODO: Change @changeProfilePicture to work for auction images, insert necessary function calls into create and update above.
 */
exports.changeAuctionPicture = function (req, res) {
  var auction = req.auction;
  var upload = multer(config.uploads.auctionUpload).single('newAuctionPicture');
  var auctionUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = auctionUploadFileFilter;

  //
  // upload(req, res, function (uploadError) {
  //   if(uploadError) {
  //     return res.status(400).send({
  //       message: 'Error occurred while uploading auction picture'
  //     });
  //   } else {
  //     console.log('in change Auction Picture ' + auction);
  //     auction.auctionImageURL = config.uploads.auctionUpload.dest + req.file.filename;
  //     console.log('after: ' + auction);
  //   }
  // });

  if (auction) {
    upload(req, res, function (uploadError) {
      if(uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading auction picture'
        });
      } else {
        auction.auctionImageURL = config.uploads.auctionUpload.dest + req.file.filename;

        auction.save(function (saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          }
          else {
            req.login(auction.user, function (err) {
              if (err) {
                res.status(400).send(err);
              } else {
                res.json(auction);
              }
            });
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};
/**
 * Delete an auction
 */
exports.delete = function (req, res) {
  var auction = req.auction;

  auction.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(auction);
    }
  });
};
/**
 * List of Auctions
 */
exports.list = function (req, res) {
  var thisWeek = new Date(Date.now());
  thisWeek = thisWeek.getWeekNumber();
  Auction.find({ weekActive: thisWeek }).sort('-created').populate('user', 'displayName').exec(function (err, auctions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(auctions);
    }
  });
};
/**
 * Middleware function for listing auctions.
 */
exports.allAuctions = function (req, res, next) {
  var thisWeek = new Date(Date.now());
  thisWeek = thisWeek.getWeekNumber();
  Auction.find({ weekActive: thisWeek }).sort('-created').populate('auction', 'title content').exec(function (err, auctions) {
    if (err) {
      return next(err);
    } else if (!auctions) {
      return res.status(404).send({
        message: 'No auctions have been found'
      });
    }
    req.auctions = auctions;
    next();
  });
};
/**
 * Auction middleware
 */
exports.auctionByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Auction is invalid'
    });
  }

  Auction.findById(id).populate('user', 'displayName').exec(function (err, auction) {
    if (err) {
      return next(err);
    } else if (!auction) {
      return res.status(404).send({
        message: 'No auction with that identifier has been found'
      });
    }
    req.auction = auction;
    next();
  });
};
