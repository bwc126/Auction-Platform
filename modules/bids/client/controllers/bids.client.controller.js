(function () {
  'use strict';

  angular
    .module('bids')
    .controller('BidsController', BidsController);

  BidsController.$inject = ['$scope', '$state', '$window', '$timeout', 'bidResolve', 'Authentication'];

  function BidsController($scope, $state, $window, $timeout, bid, Authentication) {
    var vm = this;

    vm.bid = bid;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.placeBid = placeBid;

    // Remove existing Bid
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.auction.$remove($state.go('auctions.list'));
      }
    }

    // Save Bid
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.bidForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.bid._id) {
        vm.bid.$update(successCallback, errorCallback);
      } else {
        vm.bid.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('auctions.view', {
          bidId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    // Place bid
    function placeBid() {
      console.log('bid button pushed');
    }
  }
})();
