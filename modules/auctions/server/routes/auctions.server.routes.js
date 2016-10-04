'use strict';

/**
 * Module dependencies
 */
var auctionsPolicy = require('../policies/auctions.server.policy'),
  auctions = require('../controllers/auctions.server.controller');

module.exports = function (app) {
  // Auctions collection routes
  app.route('/api/auctions').all(auctionsPolicy.isAllowed)
    .get(auctions.list)
    .post(auctions.create);

  // Single auction routes
  app.route('/api/auctions/:auctionId').all(auctionsPolicy.isAllowed)
    .get(auctions.read)
    .put(auctions.update)
    .delete(auctions.delete);

  // app.route('/api/auctions/:auctionId/picture').all(auctionsPolicy.isAllowed)
  //   .put(auctions.changeAuctionPicture);
  app.route('/api/auctions/:auctionId/picture').all(auctionsPolicy.isAllowed)
    .post(auctions.changeAuctionPicture);

  // Finish by binding the auction middleware
  app.param('auctionId', auctions.auctionByID);
};
