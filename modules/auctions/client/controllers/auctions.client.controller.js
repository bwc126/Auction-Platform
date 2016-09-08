(function () {
  'use strict';

  angular
    .module('auctions')
    .controller('AuctionsController', AuctionsController);

  AuctionsController.$inject = ['$scope', '$state', 'auctionResolve', 'Authentication', 'FileUploader'];

  function AuctionsController($scope, $state, auction, Authentication, FileUploader) {
    var vm = this;

    vm.auction = auction;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    // Create an uploader object, to handle uploaded files
    $scope.uploader = new FileUploader();
    console.log($scope.uploader);
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
  }
})();
