'use strict';

// Users service used for communicating with the users REST endpoint
angular
  .module('users')
  .factory('Users', ['$resource',
    function ($resource) {
      return $resource('api/users', {}, {
        update: {
          method: 'PUT'
        }
      });
    }
  ]).factory('UserBidsService', UserBidsService);

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

angular
  .module('users')
  .factory('ReferralsService', ReferralsService);

ReferralsService.$inject = ['$resource'];

function ReferralsService($resource) {
  return $resource('api/referrals/byUser/:userId', {
    userId: '@_id'
  }, {
    update: {
      method: 'PUT'
    }
  });
}

//TODO this should be Users service
angular.module('users.admin').factory('Admin', ['$resource',
  function ($resource) {
    return $resource('api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
