(function () {
  'use strict';

  angular
    .module('auctions')
    .controller('AuctionsController', AuctionsController);

  AuctionsController.$inject = ['$scope', '$state', '$window', '$timeout', '$http', 'auctionResolve', 'Authentication'];

  function AuctionsController($scope, $state, $window, $timeout, $http, auction, Authentication) {
    var vm = this;

    vm.auction = auction;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.placeBid = placeBid;
    vm.results = [];
    vm.userQuery = '';
    /* jshint ignore:start */
    $('.datepicker').datepicker();
    /* jshint ignore:end */
    Date.prototype.getWeekNumber = function() {
      var d = new Date(+this);
      d.setHours(0,0,0,0);
      d.setDate(d.getDate()+4-(d.getDay()||7));
      return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
    };

    // Remove existing Auction
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.auction.$remove($state.go('auctions.list'));
      }
    }

    // Save Auction
    function save(isValid) {
      console.log(vm.auction);
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.auctionForm');
        return false;
      }
      /* jshint ignore:start */
      var activeDate = $('.datepicker').datepicker('getDate');
      console.log(activeDate);
      // Convert the input date to the week number
      vm.auction.weekActive = activeDate.getWeekNumber();
      /* jshint ignore:end */

      // TODO: move create/update logic to service
      if (vm.auction._id) {
        vm.auction.$update(successCallback, errorCallback);
      } else {
        vm.auction.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('auctions.view', {
          auctionId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    // Place bid
    function placeBid() {
      console.log('bid button pushed');
      console.dir($http);
      $http.post('api/auctions/'+vm.auction._id+'/bids').then(function(response) {
        console.dir(response);
      });

    }

    vm.userSearch = function() {
      var query = vm.userQuery;
      console.log(query);
      $http.get('api/users').then(function(response) {
        var users = response.data;
        var result = users.filter(function(users){
          return (users.displayName.includes(query) || users.username.includes(query));
        });
        console.log(result);
        vm.results = result;
        vm.auction.advertiser = vm.results.length === 1 ? vm.results[0]._id : '';
      });
    };
  }
})();
