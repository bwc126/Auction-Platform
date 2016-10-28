(function () {
  'use strict';
  var BID_INCREMENT = 1.01;
  angular
    .module('auctions')
    .controller('AuctionsListController', AuctionsListController);

  AuctionsListController.$inject = ['$scope', 'AuctionsService', '$http'];

  function AuctionsListController($scope, AuctionsService, $http) {
    var vm = this;
    var updatePeriod = 900;
    vm.auctions = AuctionsService.query();
    vm.placeBid = placeBid;

    function placeBid(auction) {

      console.log(auction.amount);
      $http({
        method : 'POST',
        url : 'api/auctions/' + auction._id + '/bids',
        data : {
          'amount' : auction.amount*BID_INCREMENT.toString()
        },
      }).then(function(response) {
        console.log(response);
      });

    }
    function getCurrent(auction) {
      $http.get('/api/bids/'+auction._id+'/amount').then(function(response) {
        auction.amount = response.data.toFixed(2);
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
