(function () {
  'use strict';

  angular
    .module('bids.services')
    .factory('BidsService', BidsService)
    .factory('AuctionBidsService', AuctionBidsService)
    .factory('UserBidsService', UserBidsService);

  BidsService.$inject = ['$resource'];

  function BidsService($resource) {
    return $resource('api/auctions/:auctionId', {
      auctionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  AuctionBidsService.$inject = ['$resource'];

  function AuctionBidsService($resource) {
    return $resource('api/:auctionId/bids/:bidId', {
      auctionId: '@auction._id',
      bidId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  UserBidsService.$inject = ['$resource'];

  function UserBidsService($resource) {
    return $resource('api/bids/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

})();
