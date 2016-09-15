(function () {
  'use strict';

  angular
    .module('auctions')
    .controller('AuctionsController', AuctionsController);

  AuctionsController.$inject = ['$scope', '$state', '$window', '$timeout', 'auctionResolve', 'Authentication', 'FileUploader'];

  function AuctionsController($scope, $state, $window, $timeout, auction, Authentication, FileUploader) {
    var vm = this;

    vm.auction = auction;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    // Create an uploader object, to handle uploaded files


    $scope.user = Authentication.user;
    $scope.auction = auction;
    $scope.imageURL = $scope.auction.auctionImageURL;
    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: '/auctions/img/auctions/',
      alias: 'newAuctionPicture'
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadAuctionPicture = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
      console.log(vm.auction);

    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.auction.auctionImageURL;
    };
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
