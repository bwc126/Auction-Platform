(function() {
  'use strict';

  angular
    .module('users')
    .controller('PaymentsController', PaymentsController);

  PaymentsController.$inject = ['$http', '$scope', 'Users', 'PaymentAuthService', 'PaymentCaptureService', 'PaypalTokenService', 'Authentication'];

  function PaymentsController($http, $scope, Users, PaymentAuthService, PaymentCaptureService, PaypalTokenService, Authentication) {
    var THRESHOLD = 5.00;
    var vm = this;
    $scope.user = Authentication.user;
    var user = Authentication.user;
    $scope.generateToken = function() {
      var request = new PaypalTokenService();
      request.then(function(response) {
        console.log(response);
        Authentication.paypal = response.data.token_type + ' ' + response.data.access_token;
      });
    };
    $scope.authorizePayment = function() {
      var authAmt = (user.bidTotal + THRESHOLD).toFixed(2);
      var paymentAuth = new PaymentAuthService({ 'data' : { 'transactions': [
        {
          'amount' : {
            'total' : authAmt,
            'currency' : 'USD',
            'details' : {
              'subtotal' : authAmt
            }
          },
          'description' : 'This is to authorize an amount of '+ authAmt,
        }],
        'intent': 'authorize',
        'payer': { 'payment_method' : 'paypal' },
        'redirect_urls': {
          'return_url': 'http://localhost:3000/settings/payments',
          'cancel_url': 'http://www.hawaii.com'
        } }, 'headers' : { 'Authorization': Authentication.paypal, 'Content-Type': 'application/json' } });
      console.log(paymentAuth);
      paymentAuth.then(function(response) {
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
    };

    function capturePayment(paymentID) {
      console.log(paymentID);
      var reqURL = 'https://api.sandbox.paypal.com/v1/payments/payment/' + paymentID+'/execute';
      // + '/capture';
      var capture = new PaymentCaptureService({
        'headers': {
          'authorization': Authentication.paypal,
          'Content-Type': 'application/json',
        },
        'transactions': {
          'amount': {
            'currency': 'USD',
            'total': user.bidTotal.toFixed(2)
          }
        },
        'payer': { 'payment_method' : 'paypal' },
        'url': reqURL });

      console.log(capture);

      capture.then(function(response) {
        console.log('response from payment capture request:', response);
      });
    }
    $scope.capturePayment = capturePayment;
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
