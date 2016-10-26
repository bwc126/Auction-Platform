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
  }
})();
