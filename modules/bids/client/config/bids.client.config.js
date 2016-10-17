(function () {
  'use strict';

  angular
    .module('bids')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Bids',
      state: 'bids',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'bids', {
      title: 'View Bids',
      state: 'bids.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'bids', {
      title: 'New Bid',
      state: 'bids.create',
      roles: ['user']
    });
  }
})();
