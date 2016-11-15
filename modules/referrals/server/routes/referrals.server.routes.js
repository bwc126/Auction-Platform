'use strict';

/**
 * Module dependencies
 */
var referralsPolicy = require('../policies/referrals.server.policy'),
  path = require('path'),
  referrals = require('../controllers/referrals.server.controller'),
  users = require(path.resolve('modules/users/server/controllers/users.server.controller'));

module.exports = function (app) {
  // Referrals collection routes
  app.route('/api/referrals').all(referralsPolicy.isAllowed)
    .get(referrals.list)
    .post(referrals.create);

  // Single referral routes
  app.route('/api/referrals/:referralId').all(referralsPolicy.isAllowed)
    .get(referrals.read)
    .put(referrals.update)
    .delete(referrals.delete);

  app.route('/api/user-referrals/:userId').all(referralsPolicy.isAllowed)
    .get(referrals.referralsByUser);

  // Finish by binding the referral middleware
  app.param('referralId', referrals.referralByID);
  app.param('userId', users.userByID);
};
