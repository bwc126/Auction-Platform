'use strict';

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller');

  // Setting up the users profile api
  app.route('/api/users/me').get(users.me);
  app.route('/api/users').put(users.update);
  app.route('/api/users/accounts').delete(users.removeOAuthProvider);
  app.route('/api/users/password').post(users.changePassword);
  app.route('/api/users/picture').post(users.changeProfilePicture);
  app.route('/api/users/AuthorizePayment').post(users.authorizePayment);
  app.route('/api/users/PaypalToken').post(users.paypalTokenService);
  app.route('/api/users/PaypalPaymentAuth').post(users.paypalPaymentAuth);
  app.route('/api/users/PaypalPaymentCapture').post(users.paypalPaymentCapture);
  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};
