(function () {
  'use strict';

  angular
    .module('auctions')
    .controller('AuctionsController', AuctionsController);

  AuctionsController.$inject = ['$scope', '$state', '$window', '$timeout', '$http', 'auctionResolve', 'Authentication'];

  function AuctionsController($scope, $state, $window, $timeout, $http, auction, Authentication) {
    var vm = this;

    vm.auction = auction;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.placeBid = placeBid;

    // Remove existing Auction
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.auction.$remove($state.go('auctions.list'));
      }
    }

    // Save Auction
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.auctionForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.auction._id) {
        vm.auction.$update(successCallback, errorCallback);
      } else {
        vm.auction.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('auctions.view', {
          auctionId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    // Place bid
    function placeBid() {
      console.log('bid button pushed');
      console.dir($http);
      $http.post('api/auctions/'+vm.auction._id+'/bids').then(function(response) {
        console.dir(response);
      });

    }
  }
})();
