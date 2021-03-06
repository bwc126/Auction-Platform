(function () {
  'use strict';

  angular
    .module('bids')
    .controller('AuctionBidsListController', AuctionBidsListController)
    .controller('UserBidsListController', UserBidsListController);

  AuctionBidsListController.$inject = ['AuctionBidsService', 'auctionResolve'];

  function AuctionBidsListController(AuctionBidsService, auction) {
    var vm = this;
    console.dir(auction);
    vm.bids = AuctionBidsService.query({ 'auction' : auction });
  }

  UserBidsListController.$inject = ['$http', 'UserBidsService', 'Authentication'];

  function UserBidsListController($http, UserBidsService, Authentication) {
    var vm = this;

    $http.get('api/users/me').then(function(response) {
      $http({
        method : 'GET',
        url : 'api/bids/myBids',
        data : response.data
      }).then(function(response) {
        vm.bids = response.data;
      });
    });

  }
})();
