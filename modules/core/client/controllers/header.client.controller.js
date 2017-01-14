'use strict';

angular.module('core').controller('HeaderController', ['$http', '$scope', '$state', 'Authentication', 'Menus',
  function ($http, $scope, $state, Authentication, Menus) {
    var updatePeriod = 3000;
    var auctions;
    var tableTotal;
    $scope.tableTotal = 0;
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Get the account menu
    $scope.accountMenu = Menus.getMenu('account').items[0];

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });

    $http.get('/api/auctions').then(function(response) {
      auctions = response.data;
      // Get the total of the LT every few seconds
      var bidUpdate = window.setInterval(function() {
        tableTotal = 0;
        auctions.forEach(function(auction) {
          getCurrent(auction);
        });

      }, updatePeriod);
      // Update the displayed LT value

    });
    function getCurrent(auction) {
      $http.get('/api/bids/'+auction._id+'/leading').then(function(response) {
        auction.amount = response.data ? response.data.amount.toFixed(2) : 1.00;
        auction.leader = response.data ? response.data.user.displayName : '';
        auction.currentUser = $scope.userName;
        tableTotal += Number(auction.amount);
        $scope.tableTotal = (tableTotal*0.8).toFixed(2);
      });

    }

  }
]);
