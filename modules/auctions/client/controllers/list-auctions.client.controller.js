(function () {
  'use strict';

  angular
    .module('auctions')
    .controller('AuctionsListController', AuctionsListController);

  AuctionsListController.$inject = ['AuctionsService'];

  function AuctionsListController(AuctionsService) {
    var vm = this;

    vm.auctions = AuctionsService.query();
    vm.placeBid = placeBid;

    function placeBid() {
      console.log('bid button pushed');

    }
  }
})();
