(function() {
  'use strict';

  angular
    .module('users')
    .controller('ReferralsController', ReferralsController);

  ReferralsController.$inject = ['$http', '$scope'];

  function ReferralsController($http, $scope) {
    var vm = this;
    $scope.referrals = [];
    $scope.generateReferralLink = generateReferralLink;
    function generateReferralLink() {
      console.log('oh hai lonk i make');
      $http.post('api/referrals').then(function(response) {
        console.log(response);
        $scope.referrals.push(response.data);
      });
    };



  }


})();
