(function() {
  'use strict';

  angular
    .module('users')
    .controller('userOverviewController', userOverviewController);

  userOverviewController.$inject = ['$http'];

  function userOverviewController($http) {
    /*jshint validthis: true */
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
