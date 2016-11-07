'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication', '$http',
  function ($scope, Authentication, $http) {
    $scope.user = Authentication.user;
    console.log($scope.user);
    function generateReferralLink() {
      $http.post('api/referrals').then(function(response) {
        console.log(response);
      });

    }
  }
]);
