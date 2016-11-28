(function() {
  'use strict';

  angular
    .module('users')
    .controller('PaymentsController', PaymentsController);

  PaymentsController.$inject = ['$http', '$scope', 'Users', 'PaymentAuthService', 'PaymentExecutionService', 'Authentication'];

  function PaymentsController($http, $scope, Users, PaymentAuthService, PaymentExecutionService, Authentication) {
    var vm = this;
    $scope.user = Authentication.user;
    console.log($scope.user);
    $scope.authorizePayment = function() {
      PaymentAuthService.then(function(response) {
        console.log(response);
        $scope.created = response.data.create_time;
        var transactions = response.data.transactions[0];
        $scope.amount = transactions.amount.total + ' ' + transactions.amount.currency;
        $scope.user.currentPaymentID = response.data.id;
        var user = new Users($scope.user);
        user.$update(function (response) {
          $scope.$broadcast('show-errors-reset', 'userForm');
          $scope.success = true;
          Authentication.user = response;
          console.log(Authentication.user);
        }, function (response) {
          $scope.error = response.data.message;
        });
      });
      console.log('Should be doing something', PaymentAuthService);
    };
    // var domain = 'http://localhost:3000';
    // var hyperlink = domain + '/authentication/signup-ref/';
    // console.log($scope.user);
    // $scope.generateReferral = function() {
    //   $http.post('api/referrals').then(function(response) {
    //     $scope.referrals.push(response.data);
    //     generateLink(response.data);
    //   });
    // };
    // function generateLink(referral) {
    //   referral.url = hyperlink + referral._id;
    // }
    //
    // function getReferrals(user) {
    //   $scope.referrals = PaymentAuthService.query({ userId : user._id });
    // }
    // function getUserThenReferrals() {
    //   $http.get('api/users/me').then(function(response) {
    //     getReferrals(response.data);
    //   });
    // }
    // getUserThenReferrals();
    //
    // $scope.linkify = function(referralID) {
    //   return hyperlink + referralID;
    // };

  }


})();
