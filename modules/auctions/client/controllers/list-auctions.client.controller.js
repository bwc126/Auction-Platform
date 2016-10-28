(function () {
  'use strict';
  var BID_INCREMENT = 1.01;
  angular
    .module('auctions')
    .controller('AuctionsListController', AuctionsListController);

  AuctionsListController.$inject = ['$scope', 'Authentication', 'AuctionsService', '$http'];

  function AuctionsListController($scope, Authentication, AuctionsService, $http) {
    var vm = this;
    var updatePeriod = 900;
    vm.auctions = AuctionsService.query();
    vm.placeBid = placeBid;
    $scope.userName = Authentication.user.displayName;
    console.log(Authentication);
    function placeBid(auction) {

      console.log(auction.amount);
      $http({
        method : 'POST',
        url : 'api/auctions/' + auction._id + '/bids'
      }).then(function(response) {
        console.log(response);
      });

    }
    function getCurrent(auction) {
      $http.get('/api/bids/'+auction._id+'/leading').then(function(response) {
        auction.amount = response.data.amount.toFixed(2);
        auction.leader = response.data.user.displayName;
        auction.currentUser = $scope.userName;
      });

    }
    var bidUpdate = window.setInterval(function() {
      vm.auctions.forEach(function(auction) {
        getCurrent(auction);
      });
    }, updatePeriod);

    $scope.$on('$destroy',function() {
      window.clearInterval(bidUpdate);
    });

  }
})();
