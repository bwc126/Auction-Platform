(function() {
  'use strict';

  angular
    .module('users')
    .controller('userOverviewController', userOverviewController);

  userOverviewController.$inject = ['$http', '$scope'];

  function userOverviewController($http, $scope) {
    /*jshint validthis: true */
    var vm = this;
    vm.bids = [];
    function getLeading(auctionID) {
      $http.get('api/bids/'+auctionID+'/leading').then(function(response) {
        var leadingBid = response.data;
        if (leadingBid.user._id === vm.user._id) {
          vm.bids.push(leadingBid);
        }
      });
    }
    function getLeadingOfAllAuctions() {
      $http.get('api/auctions').then(function(response) {
        var auctions = response.data;
        var length = auctions.length;
        for (var i = 0; i < length; i++) {
          getLeading(auctions[i]._id);
        }
      });
    }
    function getUserTotal() {
      console.log('inside getUserTotal');
      $http.get('api/bids/leading').then(function(response) {
        console.log(response);
      })
    }
    $http.get('api/users/me').then(function(response) {
      vm.user = response.data;
      getLeadingOfAllAuctions();
      console.log('about to call getUserTotal');
      getUserTotal();
    });

    // function updateTotal() {
    //   var numBids = vm.bids.length;
    //   var total;
    //   for (var i = 0; i < numBids; i++) {
    //     total += vm.bids.amount;
    //   }
    // }
  }


})();
