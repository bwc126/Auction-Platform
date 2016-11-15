'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Referrals Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/referrals',
      permissions: '*'
    }, {
      resources: '/api/referrals/:referralId',
      permissions: '*'
    }, {
      resources: '/api/referrals/:referralId/picture',
      permissions: '*'
    }, {
      resources: '/api/user-referrals/:userId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/referrals',
      permissions: ['get', 'post']
    }, {
      resources: '/api/referrals/:referralId',
      permissions: ['get']
    }, {
      resources: '/api/referrals/:referralId/picture',
      permissions: '*'
    }, {
      resources: '/api/user-referrals/:userId',
      permissions: '*'
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/referrals',
      permissions: ['get']
    }, {
      resources: '/api/referrals/:referralId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Referrals Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an referral is being processed and the current user created it then allow any manipulation
  if (req.referral && req.user && req.referral.user && req.referral.user.id === req.user.id) {
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
