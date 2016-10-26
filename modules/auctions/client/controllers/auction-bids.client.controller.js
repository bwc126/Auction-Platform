(function () {
  'use strict';

  angular
    .module('auctions')
    .controller('AuctionsBidController', AuctionsBidController);

  AuctionsBidController.$inject = ['$scope', '$state', '$window', '$timeout', '$http', 'auctionResolve', 'Authentication'];

  function AuctionsBidController($scope, $state, $window, $timeout, $http, auction, Authentication) {
    var vm = this;
    $http.get('api/auctions/'+auction._id+'/bids').then(function(response) {
      vm.bids = response.data;
    });


  }
})();
