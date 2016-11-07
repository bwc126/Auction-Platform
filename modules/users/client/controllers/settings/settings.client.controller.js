'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication', '$http',
  function ($scope, Authentication, $http) {
    var vm = this;
    
    $scope.user = Authentication.user;
    console.log($scope.user);
  
  }
]);
