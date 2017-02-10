'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  bidsPolicy = require('../policies/bids.server.policy'),
  bids = require('../controllers/bids.server.controller'),
  auctions = require('../../../auctions/server/controllers/auctions.server.controller'),
  users = require(path.resolve('./modules/users/server/controllers/users.server.controller')),
  admin = require(path.resolve('./modules/users/server/controllers/admin.server.controller'));
module.exports = function (app) {
  // Bids collection routes
  app.route('/api/auctions/:auctionId/bids').all(bidsPolicy.isAllowed)
    .get(bids.listByAuction)
    .post(bids.create);

  // Single Bid routes
  app.route('/api/auctions/:auctionId/:bidId').all(bidsPolicy.isAllowed)
    .get(bids.read)
    .delete(bids.delete);

  app.route('/api/bids/:auctionId/amount').all(bidsPolicy.isAllowed)
    .get(bids.amount);

  app.route('/api/bids/:auctionId/leading').all(bidsPolicy.isAllowed)
    .get(bids.leading);

  app.route('/api/bids/myBids').all(bidsPolicy.isAllowed)
    .get(bids.listByUser);

  // Finish by binding the auction, bid middleware
  app.param('auctionId', auctions.auctionByID);
  app.param('bidId', bids.bidByID);
  app.use('/api/bids/leading', auctions.allAuctions, bids.leadingBids, users.updateUserTotal);
  // We need to use a different 'leadingBids' function that isn't user-specific
  app.use('/api/bids/winners', auctions.allLastWeekAuctions, bids.winningBids, admin.auctionWinners);
};
