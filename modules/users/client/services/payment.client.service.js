// Change the below to be inline with https://developer.paypal.com/docs/integration/direct/capture-payment/ which means we need to use the token we got from "making your first call"
(function () {
  'use strict';
  var settings = {
    'async': true,
    'crossDomain': true,
    'url': 'https://api.sandbox.paypal.com/v1/oauth2/token',
    'method': 'POST',
    'headers': {
      'content-type': 'application/x-www-form-urlencoded',
      'authorization': 'Bearer A101.noQoGKPNvV1qlNzXRWAKiFnFRKuSPMH3Vp7sF9E36msbIBsQylzE4oY4vXcmVZsX.F0Q-CgoTDPvTxUvd3POTSerjqz4',
      'cache-control': 'no-cache',
      'postman-token': 'f1f0655b-2226-f81b-0cf5-7379f6a94f1e'
    },
    'data': {}
  };

  angular
    .module('users')
    .factory('PaymentAuthService', PaymentAuthService)
    .factory('PaymentExecutionService', PaymentExecutionService);

  PaymentAuthService.$inject = ['$http'];
  // PaymentAuthService is much like other services, except it's handled with $http methods instead of $resource methods. Likewise for PaymentExecutionService.
  function PaymentAuthService($http, amount) {
    settings.url = 'https://api.sandbox.paypal.com/v1/payments/payment';
    settings.data.intent = 'order';
    settings.data.payer = {
      'payment_method' : 'paypal'
    };
    settings.data.transactions = [
      {
        'amount' : {
          'total' : amount,
          'currency' : 'USD',
          'details' : {
            'subtotal' : amount
          }
        },
        'description' : 'This is to authorize an amount of ' + amount,
      }];
    return $http(settings).then(function(response) {
      console.log(response);
    });
  }

  PaymentExecutionService.$inject = ['$http'];

  function PaymentExecutionService($http) {
    return $http(settings).then(function(response) {
      console.log(response);
    });
  }

})();
