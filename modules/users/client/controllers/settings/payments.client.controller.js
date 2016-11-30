(function() {
  'use strict';

  angular
    .module('users')
    .controller('PaymentsController', PaymentsController);

  PaymentsController.$inject = ['$http', '$scope', 'Users', 'PaymentAuthService', 'PaymentExecutionService', 'PaypalTokenService', 'Authentication'];

  function PaymentsController($http, $scope, Users, PaymentAuthService, PaymentExecutionService, PaypalTokenService, Authentication) {
    var vm = this;
    $scope.user = Authentication.user;
    $scope.generateToken = function() {
      var request = new PaypalTokenService();
      request.then(function(response) {
        console.log(response);
        Authentication.paypal = response.data.token_type + ' ' + response.data.access_token;
      });
    };
    $scope.authorizePayment = function() {
      var authRequest = new PaymentAuthService({ 'headers': {'authorization': Authentication.paypal} });
      console.log(authRequest);
      authRequest.then(function(response) {
        console.log(authRequest, response);
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
    };
    $scope.generateToken();
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
