(function() {
  'use strict';

  angular.module('auctions').directive('test1', test1);
  // TODO: HTML directives seem to require $compile, which isn't native angular apparently.
  test1.$inject = [];

  function test1() {
    return {
      restrict: 'E',
      scope: { text: '@' },
      templateUrl: 'modules/auctions/client/views/change-auction-picture.client.view.html',
      controller: 'ChangeAuctionPictureController'
    };
  }

})();
