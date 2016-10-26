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
      title: 'View Poop',
      state: 'bids.listByUser'
    });
  }
})();
