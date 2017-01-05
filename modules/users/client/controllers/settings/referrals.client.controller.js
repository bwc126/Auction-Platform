(function() {
  'use strict';

  angular
    .module('users')
    .controller('ReferralsController', ReferralsController);

  ReferralsController.$inject = ['$http', '$scope', 'Authentication', 'ReferralsService'];

  function ReferralsController($http, $scope, Authentication, ReferralsService) {
    var vm = this;
    $scope.referrals = [];
    $scope.user = Authentication.user;

    // This needs to be changed depending on the hosting environment
    var domain = 'http://localhost:3000';
    var hyperlink = domain + '/authentication/signup-ref/';
    console.log($scope.user);
    $scope.generateReferral = function() {
      $http.post('api/referrals').then(function(response) {
        $scope.referrals.push(response.data);
        generateLink(response.data);
      });
    };
    function generateLink(referral) {
      referral.url = hyperlink + referral._id;
    }

    function getReferrals(user) {
      $scope.referrals = ReferralsService.query({ userId : user._id });
    }
    function getUserThenReferrals() {
      $http.get('api/users/me').then(function(response) {
        getReferrals(response.data);
      });
    }
    getUserThenReferrals();

    $scope.linkify = function(referralID) {
      return hyperlink + referralID;
    };

  }


})();
