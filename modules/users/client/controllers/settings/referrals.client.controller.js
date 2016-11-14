(function() {
  'use strict';

  angular
    .module('users')
    .controller('ReferralsController', ReferralsController);

  ReferralsController.$inject = ['$http', '$scope'];

  function ReferralsController($http, $scope) {
    var vm = this;
    $scope.referrals = [];

    // This needs to be changed depending on the hosting environment
    var domain = "http://localhost:3000";
    var hyperlink = domain + "/authentication/signup-ref/";

    $scope.generateReferral = function() {
      console.log('oh hai lonk i make');
      $http.post('api/referrals').then(function(response) {
        console.log(response);
        $scope.referrals.push(response.data);
        generateLink(response.data);
      });
    };

    function generateLink(referral) {
      referral.url = hyperlink + referral._id;
    }

    function getReferrals() {
      
    }


  }


})();
