(function() {
  'use strict';

  angular
    .module('users')
    .controller('WinnersController', WinnersController);

  WinnersController.$inject = ['$http', '$scope', '$state', '$window', 'Authentication'];

  function WinnersController($http, $scope, $state, $window, Authentication) {
    var vm = this;
    vm.LTWinners = [];
    vm.auctionWinners = [];
    // Use functions to get LT and auction winners
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    vm.getLTWinners = function() {
      // Use the entries api to get a batch of LT Winners
      $http.get('/api/lootTable/winners').then(function(response) {
        console.log(response.data);
        // Loop through the response, build an array of only what we're interested in, then find the unique set of that
        vm.LTWinners = response.data.filter(onlyUnique);
      });
    };
    vm.getAuctionWinners = function() {
      // For each auction, get the winner's shipping and email info, and the item they won
      $http.get('/api/bids/winners').then(function(response) {
        console.log(response);
        vm.auctionWinners = response.data;
        // var auctions = response.data;
        // var numAuctions = Object.keys(auctions).length;
        // var pairing = {
        //   'auction': {},
        //   'user': {}
        // };
        // for (var i = 0; i < numAuctions; i++) {
        //   pairing.auction.name = Object.keys(auctions)[i].title + ', ' + Object.keys(auctions)[i].content;
        //   pairing.user.name = Object.values(auctions)[i].displayName;
        //   pairing.user.address = Object.values(auctions)[i].address + ', '+ Object.values(auctions)[i].region;
        //   pairing.user.email = Object.values(auctions)[i].email;
        //   vm.auctionWinners.push(pairing);
        // }
        console.log(vm.auctionWinners);
      });
    };
  }

})();
