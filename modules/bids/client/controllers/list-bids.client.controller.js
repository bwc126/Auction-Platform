(function () {
  'use strict';

  angular
    .module('bids')
    .controller('AuctionBidsListController', AuctionBidsListController)
    .controller('UserBidsListController', UserBidsListController);

  AuctionBidsListController.$inject = ['AuctionBidsService', 'auctionResolve'];

  function AuctionBidsListController(AuctionBidsService, auction) {
    var vm = this;

    vm.bids = AuctionBidsService.query({ 'auction' : auction });
  }

  UserBidsListController.$inject = ['UserBidsService', 'Authentication'];

  function UserBidsListController(UserBidsService, Authentication) {
    var vm = this;
    var user = Authentication.user;
    vm.bids = UserBidsService.query({ 'user' : user });
  }
})();
