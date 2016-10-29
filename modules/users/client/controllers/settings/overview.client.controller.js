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
    $http.get('api/users/me').then(function(response) {
      vm.user = response.data;
    });

    $http.get('api/auctions').then(function(response) {
      var auctions = response.data;
      var length = auctions.length;
      for (var i = 0; i < length; i++) {
        getLeading(auctions[i]._id);
      }
    });

    function getLeading(auctionID) {
      $http.get('api/bids/'+auctionID+'/leading').then(function(response) {
          var leadingBid = response.data;
          if (leadingBid.user._id === vm.user._id) {
            vm.bids.push(leadingBid);
          }
        });
    };
  }
})();
