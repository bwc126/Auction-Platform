(function() {
  'use strict';

  angular
    .module('users')
    .controller('PaymentsController', PaymentsController);

  PaymentsController.$inject = ['$location', '$http', '$scope', 'Users', 'PaymentAuthService', 'PaymentCaptureService', 'PaypalTokenService', 'Authentication'];

  function PaymentsController($location, $http, $scope, Users, PaymentAuthService, PaymentCaptureService, PaypalTokenService, Authentication) {
    var THRESHOLD = 5.00;
    var vm = this;
    $scope.user = Authentication.user;
    var user = Authentication.user;
    $scope.generateToken = function() {
      // var request = new PaypalTokenService();
      // request.then(function(response) {
      //   console.log(response);
      //   Authentication.paypal = response.data.token_type + ' ' + response.data.access_token;
      // });
      console.log('generateToken');
      $http.post('/api/users/PaypalToken').then(function(response) {
        var data = JSON.parse(response.data);
        Authentication.paypal = data.token_type + ' ' + data.access_token;
        console.log('Response: ', JSON.parse(response.data));
      });
      console.log('finish generate');
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
          'cancel_url': 'http://localhost:3000/settings/payments'
        } }, 'headers' : { 'Authorization': Authentication.paypal, 'Content-Type': 'application/json' } });
      console.log(paymentAuth);
      paymentAuth.then(function(response) {
        console.log(response);
        $scope.created = response.data.create_time;

        var transactions = response.data.transactions[0];
        $scope.amount = transactions.amount.total + ' ' + transactions.amount.currency;
        $scope.user.currentPaymentID = response.data.id;
        $scope.authLink = response.data.links[1].href;

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
    // This is where we extract paypal's addendum to our URL containing the payerID
    if ($location.absUrl().split('&')[2]) {
      var payerQuery = $location.absUrl().split('&')[2];
      var payerID = payerQuery.split('=')[1];
      console.log(payerID);
    }
    function capturePayment(paymentID, payerID) {
      console.log(paymentID);
      var reqURL = 'https://api.sandbox.paypal.com/v1/payments/payment/'+paymentID+'/execute';
      var capture = new PaymentCaptureService({
        'headers': {
          'authorization': Authentication.paypal,
          'Content-Type': 'application/json',
        },
        'data' : {
          'transactions': [{
            'amount': {
              'currency': 'USD',
              'total': user.bidTotal.toFixed(2)
            }
          }],
          'payer_id': payerID,
        },
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
