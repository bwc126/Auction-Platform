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
        url: ':auctionId/bids',
        template: '<ui-view/>'
      })
      .state('bids.list', {
        url: '',
        templateUrl: 'modules/bids/client/views/list-bids.client.view.html',
        controller: 'BidsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Bids List'
        }
      })
      .state('bids.create', {
        url: '/create',
        templateUrl: 'modules/bids/client/views/form-bid.client.view.html',
        controller: 'BidsController',
        controllerAs: 'vm',
        resolve: {
          bidResolve: newBid
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'New Bid'
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
      .state('bids.place', {
        templateUrl: 'modules/bids/client/views/place-bid.client.view.html',
        controller: 'BidsController',
        controllerAs: 'vm',
        resolve: {
          bidResolve: newBid
        },
        data: {
          roles: ['user', 'admin'],
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

  newBid.$inject = ['BidsService'];

  function newBid(BidsService) {
    return new BidsService();
  }
})();
