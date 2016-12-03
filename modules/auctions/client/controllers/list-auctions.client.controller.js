(function () {
  'use strict';
  var BID_INCREMENT = 1.01;
  var THRESHOLD = 10.00;
  angular
    .module('auctions')
    .controller('AuctionsListController', AuctionsListController);

  AuctionsListController.$inject = ['$scope', 'Authentication', 'AuctionsService', 'PaymentAuthService', '$http'];

  function AuctionsListController($scope, Authentication, AuctionsService, PaymentAuthService, $http) {
    var vm = this;
    $scope.authentication = Authentication;
    vm.authentication = Authentication;
    var user = vm.authentication.user;
    $scope.userName = user.displayName;

    var updatePeriod = 900;
    vm.auctions = AuctionsService.query();
    vm.placeBid = placeBid;
    console.log(Authentication);
    var newAuthAmt;
    var paymentAuth;
    // Make a post request to place the bid.
    function placeBid(auction) {
      console.log(user.bidTotal);
      console.log(auction.amount);
      // Before a bid is placed, we should compare the user's current total to the user's authorized amount. If it doesn't surpass the threshold, we should prompt the user to approve a new authorization.
      if (user.authorizedAmount < (user.bidTotal + THRESHOLD)) {
        // Request new authorization amount.
        newAuthAmt = (user.authorizedAmount + (THRESHOLD * 2)).toFixed(2);
        paymentAuth = new PaymentAuthService(newAuthAmt);

        paymentAuth.then(function(response) {
          console.log(response);
        });
      }
      else {
        // Place the bid.
        $http({
          method : 'POST',
          url : 'api/auctions/' + auction._id + '/bids'
        }).then(function(response) {
          console.log(response);
        });
      }
    }
    // Get the current leading bid
    function getCurrent(auction) {
      $http.get('/api/bids/'+auction._id+'/leading').then(function(response) {
        auction.amount = response.data.amount.toFixed(2);
        auction.leader = response.data.user.displayName;
        auction.currentUser = $scope.userName;
      });

    }
    // For each auction, get the current leading bid.
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
