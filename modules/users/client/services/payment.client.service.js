// Change the below to be inline with https://developer.paypal.com/docs/integration/direct/capture-payment/ which means we need to use the token we got from 'making your first call'
(function () {
  'use strict';
  var settings = {
    'method': 'POST',
    'headers': {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer A101.u9rXOqFGACpFpDS7a367BjZVDErXI48gWeeH8inUXusD205PYbrVO7iCui1TLU-i.czhh_Sm8Yp92tg6zHeoIA61fZrK',
    },
    'data': {},
    'ignoreAuthModule': 'true'
  };

  angular
    .module('users')
    .factory('PaymentAuthService', PaymentAuthService)
    .factory('PaymentCaptureService', PaymentCaptureService)
    .factory('PaypalTokenService', PaypalTokenService);

  PaymentAuthService.$inject = ['$http'];
  // PaymentAuthService is much like other services, except it's handled with $http methods instead of $resource methods. Likewise for PaymentExecutionService.
  function PaymentAuthService($http) {
    var amount = 1.00;

    var settings = {
      'method': 'POST',
      'data': {}
    };
    settings.data.intent = 'authorize';
    settings.data.payer = {
      'payment_method' : 'paypal'
    };
    settings.url = 'https://api.sandbox.paypal.com/v1/payments/payment';
    // settings.data.transactions = [
    //   {
    //     'amount' : {
    //       'total' : amount,
    //       'currency' : 'USD',
    //       'details' : {
    //         'subtotal' : amount
    //       }
    //     },
    //     'description' : 'This is to authorize an amount of '+amount,
    //   }];
    settings.data.redirect_urls = {
      'return_url': 'http://www.google.com',
      'cancel_url': 'http://www.hawaii.com'
    };
    settings.ignoreAuthModule = true;
    var service = function(args) {
      angular.extend(settings, args);
      return $http(settings);
    };
    return service;
  }

  PaymentCaptureService.$inject = ['$http'];

  function PaymentCaptureService($http) {
    var settings = {
      'method': 'POST',
    };
    settings.ignoreAuthModule = true;
    var service = function(args) {
      // settings.url = 'https://api.sandbox.paypal.com/v1/payments/authorization'+id+'/capture';
      angular.extend(settings, args);
      return $http(settings);
    };
    return service;
  }

  // PaypalTokenService requests an access token from paypal. Eventually, this will be done using the user's auth info from their linked paypal account.
  PaypalTokenService.$inject = ['$http'];
  // TODO: Correct 'client credentials are missing' error.
  function PaypalTokenService($http) {
    // settings.url = 'https://api.sandbox.paypal.com/v1/oauth2/token';
    // settings.headers.Authorization = 'Basic QVoyR3FxcGNSZUFBSzZMUFY2TVpLN3lKYU9KQkRUeXotOWlnNnVmSU96dXBQQ3hsTmFzQWZHU19DSm8xZXBIM0gwdm9EX2hMVHBUekNWN2E6RU1JOFRtZ215WHpRb0dPWFpkVDJXUWltdnIyTkVjZUdCUnVsVldyTUEycVlFNFpYRm1xTllLN2hVckFxbndHODQ3UjBxYWhVdUY2Zmo0dDM=';
    // settings.headers['cache-control'] = 'no-cache';
    // settings.data.grant_type = 'client_credentials';
    var settings = {
      'async': true,
      'crossDomain': true,
      'url': 'https://api.sandbox.paypal.com/v1/oauth2/token',
      'method': 'POST',
      'headers': {
        'content-type': 'application/x-www-form-urlencoded',
        'authorization': 'Basic QVoyR3FxcGNSZUFBSzZMUFY2TVpLN3lKYU9KQkRUeXotOWlnNnVmSU96dXBQQ3hsTmFzQWZHU19DSm8xZXBIM0gwdm9EX2hMVHBUekNWN2E6RU1JOFRtZ215WHpRb0dPWFpkVDJXUWltdnIyTkVjZUdCUnVsVldyTUEycVlFNFpYRm1xTllLN2hVckFxbndHODQ3UjBxYWhVdUY2Zmo0dDM=',
        'cache-control': 'no-cache',
        'postman-token': 'bf5aa707-66c2-92f0-3c0e-af24e992b841'
      },
      'data': 'grant_type=client_credentials',
      'ignoreAuthModule': 'true'
    };
    var service = function(args) {
      angular.extend(settings, args);
      return $http(settings);
    };
    return service;
  }

})();
