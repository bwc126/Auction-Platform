(function () {
  'use strict';

  angular
    .module('auctions')
    .controller('AuctionsListController', AuctionsListController);

  AuctionsListController.$inject = ['AuctionsService', '$http'];

  function AuctionsListController(AuctionsService, $http) {
    var vm = this;

    vm.auctions = AuctionsService.query();
    vm.placeBid = placeBid;

    function placeBid(auctionID) {

      $http.post('api/auctions/' + auctionID + '/bids').then(function(response) {

      });

    }
    function getCurrent(auction) {
      console.log('get current running');
      $http.get('/api/bids/'+auction._id+'/amount').then(function(response) {
        auction.amount = response.data;
      });

    }
    window.setInterval(function() {
      vm.auctions.forEach(function(auction) {
        console.log('forEach called');
        getCurrent(auction);
      });
    }, 200);
  }
})();
