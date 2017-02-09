(function() {
  'use strict';
  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$http', '$scope', '$state', 'Authentication', 'Menus'];


  function HeaderController($http, $scope, $state, Authentication, Menus) {
    var updatePeriod = 3000;
    var auctions;
    var tableTotal;
    var auctionTotal;
    var userAuctions;
    var numAuctions;
    $scope.tableTotal = 0;
    $scope.auctionTotal = 0;
    $scope.userAuctions = [];
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;
    $scope.user = Authentication.user;

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
        auctionTotal = 0;
        userAuctions = [];
        numAuctions = auctions.length;
        // console.log('Should be total auctions: ',numAuctions);
        auctions.forEach(function(auction) {
          getCurrent(auction);

        });

      }, updatePeriod);
      // Update the displayed LT value

    });
    function finish(numUserAuctions, userAuctionList, lootTableTotal) {
      // console.log("in finish");
      if ($scope.auctionTotal !== numUserAuctions) {
        $scope.auctionTotal = numUserAuctions;
      }
      if ($scope.userAuctions !== userAuctionList) {
        $scope.userAuctions = userAuctionList;
      }
      if ($scope.tableTotal !== lootTableTotal) {
        $scope.tableTotal = lootTableTotal;
        $scope.shownTotal = (lootTableTotal*0.8).toFixed(2);
      }

    }
    function getCurrent(auction) {
      $http.get('/api/bids/'+auction._id+'/leading').then(function(response) {
        auction.amount = response.data ? response.data.amount.toFixed(2) : 1.00;
        auction.leader = response.data ? response.data.user.displayName : '';
        auction.currentUser = $scope.userName;
        tableTotal += Number(auction.amount);
        // tableTotal = (tableTotal*0.8).toFixed(2);
        // console.log(tableTotal);
        auctionTotal = auction.leader === $scope.authentication.user.displayName ? auctionTotal += 1 : auctionTotal;

        if (auction.leader === $scope.authentication.user.displayName) {
          userAuctions.push(auction);
        }
        if (numAuctions === 1) {
          finish(auctionTotal, userAuctions, tableTotal);
          return;
        }
        // console.log('Should be remaining Auctions: ',numAuctions);
        numAuctions -= 1;
        // console.log('Should be one less: ',numAuctions);
      });

    }

    // function getUserBids() {
    //
    //   function getLeading(auctionID) {
    //     $http.get('api/bids/'+auctionID+'/leading').then(function(response) {
    //       if (response.data) {
    //         var leadingBid = response.data;
    //         if (leadingBid.user._id === $scope.authentication.user._id) {
    //           vm.bids.push(leadingBid);
    //
    //         }
    //       }
    //     });
    //   }
    //   function getLeadingOfAllAuctions() {
    //     $http.get('api/auctions').then(function(response) {
    //       var auctions = response.data;
    //       var length = auctions.length;
    //       for (var i = 0; i < length; i++) {
    //         getLeading(auctions[i]._id);
    //       }
    //     });
    //   }
    // }

  }

})();
