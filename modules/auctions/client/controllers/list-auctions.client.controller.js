(function () {
  'use strict';

  angular
    .module('auctions')
    .controller('AuctionsListController', AuctionsListController);

  AuctionsListController.$inject = ['$scope', 'AuctionsService', '$http'];

  function AuctionsListController($scope, AuctionsService, $http) {
    var vm = this;
    var updatePeriod = 900;
    vm.auctions = AuctionsService.query();
    vm.placeBid = placeBid;

    function placeBid(auctionID) {

      $http.post('api/auctions/' + auctionID + '/bids').then(function(response) {

      });

    }
    function getCurrent(auction) {
      console.log('get current running');
      $http.get('/api/bids/'+auction._id+'/amount').then(function(response) {
        auction.amount = response.data.toFixed(2);
      });

    }
    var bidUpdate = window.setInterval(function() {
      vm.auctions.forEach(function(auction) {
        console.log('forEach called');
        getCurrent(auction);
      });
    }, updatePeriod);

    $scope.$on('$destroy',function() {
      window.clearInterval(bidUpdate);
    });

  }
})();
