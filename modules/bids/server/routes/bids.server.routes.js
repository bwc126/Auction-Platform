'use strict';

/**
 * Module dependencies
 */
var bidsPolicy = require('../policies/bids.server.policy'),
  bids = require('../controllers/bids.server.controller');

module.exports = function (app) {
  // Auctions collection routes
  app.route('/api/auctionId/bids').all(bidsPolicy.isAllowed)
    .get(bids.list)
    .post(bids.create);

  // Single auction routes
  app.route('/api/auctions/:auctionId/:bidId').all(bidsPolicy.isAllowed)
    .get(bids.read)
    .put(bids.update)
    .delete(bids.delete);

  // Finish by binding the auction middleware
  app.param('auctionId', auctions.auctionByID);
  app.param('bidId', bids.bidByID);
};
