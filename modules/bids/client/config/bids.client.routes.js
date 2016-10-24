(function () {
  'use strict';

  angular
    .module('bids.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('bids', {
        abstract: true,
        url: '/:auctionId/bids',
        template: '<ui-view/>'
      })
      .state('bids.listByUser', {
        url: '/../../myBids',
        templateUrl: 'modules/bids/client/views/list-bids.client.view.html',
        controller: 'UserBidsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Bids List'
        }
      })
      .state('bids.listByAuction', {
        url: '',
        templateUrl: 'modules/bids/client/views/list-bids.client.view.html',
        controller: 'AuctionBidsListController',
        controllerAs: 'vm',
        resolve: {
          auctionResolve: getAuction
        },
        data: {
          pageTitle: 'Bids List',
          auction: '{{ auctionResolve }}'
        }
      })
      .state('bids.cancel', {
        url: '/:bidId/cancel',
        templateUrl: 'modules/bids/client/views/cancel-bid.client.view.html',
        controller: 'BidsController',
        controllerAs: 'vm',
        resolve: {
          bidResolve: getBid
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Cancel Bid {{ bidResolve.title }}'
        }
      })
      .state('bids.view', {
        url: '/:bidId',
        templateUrl: 'modules/Bids/client/views/view-bid.client.view.html',
        controller: 'BidsController',
        controllerAs: 'vm',
        resolve: {
          bidResolve: getBid
        },
        data:{
          pageTitle: 'Bid {{ bidResolve.title }}'
        }
      });
  }

  getBid.$inject = ['$stateParams', 'BidsService'];

  function getBid($stateParams, BidsService) {
    return BidsService.get({
      bidId: $stateParams.bidId
    }).$promise;
  }

  getAuction.$inject = ['$stateParams', 'AuctionsService'];

  function getAuction($stateParams, AuctionsService) {
    return AuctionsService.get({
      auctionId: $stateParams.auctionId
    }).$promise;
  }

  newBid.$inject = ['BidsService'];

  function newBid(BidsService) {
    return new BidsService();
  }
})();
