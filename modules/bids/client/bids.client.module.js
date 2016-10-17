(function (app) {
  'use strict';

  app.registerModule('bids');
  app.registerModule('bids.services');
  app.registerModule('bids.routes', ['ui.router', 'bids.services']);
})(ApplicationConfiguration);
