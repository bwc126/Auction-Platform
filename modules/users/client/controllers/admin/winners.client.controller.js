(function() {
  'use strict';

  angular
    .module('users')
    .controller('WinnersController', WinnersController);

  WinnersController.$inject = ['$http', '$scope', '$state', '$window', 'Authentication'];

  function WinnersController($http, $scope, $state, $window, Authentication) {
    var vm = this;
    vm.LTWinners = [];
    // Use functions to get LT and auction winners
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    function getLTWinners() {
      // Use the entries api to get a batch of LT Winners
      $http.get('/api/lootTable/winners').then(function(response) {
        console.log(response.data);
        // Loop through the response, build an array of only what we're interested in, then find the unique set of that
        vm.LTWinners = response.data.filter(onlyUnique);
      });
    }
    function getAuctionWinner() {
      // For each auction, get the winner's shipping and email info, and the item they won
    }
    vm.getLTWinners = getLTWinners;
  }

})();
