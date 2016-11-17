
(function () {
  'use strict';
  var settings = {
    'async': true,
    'crossDomain': true,
    'url': 'https://api.sandbox.paypal.com/v1/oauth2/token',
    'method': 'POST',
    'headers': {
      'content-type': 'application/x-www-form-urlencoded',
      'authorization': 'Basic QVoyR3FxcGNSZUFBSzZMUFY2TVpLN3lKYU9KQkRUeXotOWlnNnVmSU96dXBQQ3hsTmFzQWZHU19DSm8xZXBIM0gwdm9EX2hMVHBUekNWN2E6RU1JOFRtZ215WHpRb0dPWFpkVDJXUWltdnIyTkVjZUdCUnVsVldyTUEycVlFNFpYRm1xTllLN2hVckFxbndHODQ3UjBxYWhVdUY2Zmo0dDM=',
      'cache-control': 'no-cache',
      'postman-token': 'f1f0655b-2226-f81b-0cf5-7379f6a94f1e'
    },
    'data': {
      'grant_type': 'client_credentials'
    }
  };

  angular
    .module('users.services')
    .factory('PaymentAuthService', PaymentAuthService)
    .factory('PaymentExecutionService', PaymentExecutionService);

  PaymentAuthService.$inject = ['$http'];

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
