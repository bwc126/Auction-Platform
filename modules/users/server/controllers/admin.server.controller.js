'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Show the current user
 */
exports.read = function (req, res) {
  res.json(req.model);
};

/**
 * Update a User
 */
exports.update = function (req, res) {
  var user = req.model;

  //For security purposes only merge these parameters
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.displayName = user.firstName + ' ' + user.lastName;
  user.roles = req.body.roles;
  user.socialLinks = req.body.socialLinks;

  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * Delete a user
 */
exports.delete = function (req, res) {
  var user = req.model;

  user.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * List of Users
 */
exports.list = function (req, res) {
  User.find({}, '-salt -password').sort('-created').populate('user', 'displayName').exec(function (err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(users);
  });
};

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findById(id, '-salt -password').exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load user ' + id));
    }

    req.model = user;
    next();
  });
};
exports.listUsers = function (req, res, next) {
  User.find({}, '-salt -password').sort('-created').populate('user', 'displayName').exec(function (err, users) {
    if (err) {
      return next(err);
    } else if (!users) {
      return next(new Error('Failed to load users'));
    }

    req.model = users;
    next();
  });
};
// Entries middleware

exports.drawWinners = function (req,res,next) {
  // Each entry is assigned a number between one and the total entries, and a random number is generated to select a winning entry. This random number selection is repeated 3 times.
  var numUsers = Object.keys(req.dict).length;
  var Entries = [];
  var winners = [];
  var numDraws = 100;
  console.log(req.dict, numUsers);
  for (var i in req.dict) {
    var numEntries = req.dict[i];
    console.log('numEntries: ',numEntries,'i: ',i);
    for (var j = 0; j < req.dict[i]; j++) {
      Entries.push(i);
    }
  }
  function addWinner(WinnerID, Iteration) {
    User.findById(WinnerID, '-salt -password -updated -profileImageURL -created').exec(function(err, user) {
      winners[Iteration] = user;
      if (Iteration === (numDraws-1)) {
        res.json(winners);
      }
    });
  }
  for (var k = 0; k < numDraws; k++) {
    var winnerID = Entries[Math.floor(Math.random() * Entries.length)];
    addWinner(winnerID, k);
  }

};

exports.auctionWinners = function(req, res) {
  var numWinners = req.bids.length;
  var winnerTable = {};
  for (var i = 0; i < numWinners; i++) {
    console.log(req.bids[i]);
    winnerTable[i] = {
      'auction' : req.bids[i].auction,
      'user' : req.bids[i].user
    };
  }
  res.json(winnerTable);
};
