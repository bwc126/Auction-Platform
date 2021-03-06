'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Auctions Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/auctions/:auctionId/bids',
      permissions: '*'
    }, {
      resources: '/api/auctions/:auctionId/:bidId',
      permissions: '*'
    }, {
      resources: '/api/bids/:auctionId/amount',
      permissions: ['*']
    }, {
      resources: '/api/bids/:auctionId/leading',
      permissions: ['*']
    }, {
      resources: '/api/bids/myBids',
      permissions: ['*']
    }, {
      resources: '/api/bids/leading',
      permissions: ['get']
    }, {
      resources: '/api/bids/winners',
      permissions: ['get']
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/auctions/:auctionId/bids',
      permissions: ['get', 'post']
    }, {
      resources: '/api/auctions/:auctionId/:bidId',
      permissions: ['get', 'delete']
    }, {
      resources: '/api/bids/:auctionId/amount',
      permissions: ['get']
    }, {
      resources: '/api/bids/:auctionId/leading',
      permissions: ['get']
    }, {
      resources: '/api/bids/myBids',
      permissions: ['get']
    }, {
      resources: '/api/bids/leading',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/auctions/:auctionId/bids',
      permissions: ['get']
    }, {
      resources: '/api/auctions/:auctionId/:bidId',
      permissions: ['get']
    }, {
      resources: '/api/bids/:auctionId/leading',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Auctions Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an auction is being processed and the current user created it then allow any manipulation
  if (req.auction && req.user && req.auction.user && req.auction.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
