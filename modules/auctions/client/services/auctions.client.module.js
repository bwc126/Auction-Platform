(function (app) {
  'use strict';

  app.registerModule('auctions');
  app.registerModule('auctions.services');
  app.registerModule('auctions.routes', ['ui.router', 'auctions.services']);
})(ApplicationConfiguration);
