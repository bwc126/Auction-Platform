(function () {
  'use strict';

  angular
    .module('auctions')
    .controller('ChangeAuctionPictureController', ChangeAuctionPictureController);

  ChangeAuctionPictureController.$inject = ['$scope', '$state', '$timeout', '$window', 'auctionResolve', 'Authentication', 'FileUploader'];

  function ChangeAuctionPictureController($scope, $state, $timeout, $window, auction, Authentication, FileUploader) {
    var vm = this;
    console.dir($state);

    $scope.user = Authentication.user;
    $scope.imageURL = auction.auctionImageURL;
    console.log(auction);
    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/auctions/'+auction._id,
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
    $scope.uploadProfilePicture = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = auction.auctionImageURL;
    };
  }
})();
