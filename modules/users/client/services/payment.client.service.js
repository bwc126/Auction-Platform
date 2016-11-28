// Change the below to be inline with https://developer.paypal.com/docs/integration/direct/capture-payment/ which means we need to use the token we got from "making your first call"
(function () {
  'use strict';
  var settings = {
    'method': 'POST',
    'headers': {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer A101.u9rXOqFGACpFpDS7a367BjZVDErXI48gWeeH8inUXusD205PYbrVO7iCui1TLU-i.czhh_Sm8Yp92tg6zHeoIA61fZrK',
    },
    'data': {}
  };

  angular
    .module('users')
    .factory('PaymentAuthService', PaymentAuthService)
    .factory('PaymentExecutionService', PaymentExecutionService);

  PaymentAuthService.$inject = ['$http'];
  // PaymentAuthService is much like other services, except it's handled with $http methods instead of $resource methods. Likewise for PaymentExecutionService.
  function PaymentAuthService($http) {
    settings.url = 'https://api.sandbox.paypal.com/v1/payments/payment';
    settings.data.intent = 'authorize';
    settings.data.payer = {
      'payment_method' : 'paypal'
    };
    settings.data.transactions = [
      {
        'amount' : {
          'total' : '1.00',
          'currency' : 'USD',
          'details' : {
            'subtotal' : '1.00'
          }
        },
        'description' : 'This is to authorize an amount of $1.00',
      }];
    settings.data.redirect_urls = {
      'return_url': 'http://www.google.com',
      'cancel_url': 'http://www.hawaii.com'
    };
    return $http(settings);
  }

  PaymentExecutionService.$inject = ['$http'];

  function PaymentExecutionService($http) {
    return $http(settings);
  }

})();
