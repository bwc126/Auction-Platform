(function () {
  'use strict';

  angular
    .module('bids.services')
    .factory('AuctionBidsService', AuctionBidsService)
    .factory('UserBidsService', UserBidsService);

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
    return $resource('api/bids/myBids', {
      update: {
        method: 'PUT'
      }
    });
  }

})();
