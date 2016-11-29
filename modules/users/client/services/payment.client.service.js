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
    .factory('PaymentExecutionService', PaymentExecutionService)
    .factory('PaypalTokenService', PaypalTokenService);

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

  // PaypalTokenService requests an access token from paypal. Eventually, this will be done using the user's auth info from their linked paypal account.
  PaypalTokenService.$inject = ['$http'];
  // TODO: Correct 'client credentials are missing' error. 
  function PaypalTokenService($http) {
    settings.url = 'https://api.sandbox.paypal.com/v1/oauth2/token';
    settings.headers.Authorization = 'Basic QVoyR3FxcGNSZUFBSzZMUFY2TVpLN3lKYU9KQkRUeXotOWlnNnVmSU96dXBQQ3hsTmFzQWZHU19DSm8xZXBIM0gwdm9EX2hMVHBUekNWN2E6RU1JOFRtZ215WHpRb0dPWFpkVDJXUWltdnIyTkVjZUdCUnVsVldyTUEycVlFNFpYRm1xTllLN2hVckFxbndHODQ3UjBxYWhVdUY2Zmo0dDM=';
    settings.headers['cache-control'] = 'no-cache';
    settings.data.grant_type = 'client_credentials';
    return $http(settings);
  }

})();
