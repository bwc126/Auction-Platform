(function() {
  'use strict';

  angular
    .module('users')
    .controller('WinnersController', WinnersController);

  WinnersController.$inject = ['$http', '$scope', '$state', '$window', 'Authentication'];

  function WinnersController($http, $scope, $state, $window, Authentication) {
    var vm = this;
    // Use functions to get LT and auction winners
    function getLTWinners() {
      // Use the entries api to get a batch of LT Winners
      $http.get('/api/lootTable/winners').then(function(response) {
        vm.LTWinners = new Set(response.data);
      });
    }
    function getAuctionWinner() {
      // For each auction, get the winner's shipping and email info, and the item they won
    }
  }

})();
