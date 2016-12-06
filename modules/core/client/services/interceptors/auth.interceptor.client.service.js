'use strict';

angular.module('core').factory('authInterceptor', ['$q', '$injector', 'Authentication',
  function ($q, $injector, Authentication) {
    return {
      // Looks like this is what happens any time a controller using the authentication variable gets an error. Repeated sign-ins usually involve this.
      responseError: function(rejection) {
        console.log(rejection);
        if (!rejection.config.ignoreAuthModule) {
          switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              $injector.get('$state').transitionTo('authentication.signin');
              break;
            case 403:
              $injector.get('$state').transitionTo('forbidden');
              break;
          }
        }
        // otherwise, default behaviour
        return $q.reject(rejection);
      }
    };
  }
]);
