(function () {
  'use strict';
  angular
    .module('auctions')
    .controller('AuctionsListController', AuctionsListController);

  AuctionsListController.$inject = ['$scope', 'Authentication', 'AuctionsService', 'PaymentAuthService', 'PaypalTokenService', 'Users', '$http'];

  function AuctionsListController($scope, Authentication, AuctionsService, PaymentAuthService, PaypalTokenService, Users, $http) {
    var THRESHOLD = 5.00;
    var updatePeriod = 900;
    var vm = this;
    $scope.authentication = Authentication;
    var user = Authentication.user;
    $scope.userName = user.displayName;

    vm.auctions = AuctionsService.query();
    vm.placeBid = placeBid;
    console.log(Authentication);
    var newAuthAmt;
    var paymentAuth;

    if (!Authentication.paypal) {
      var paypalToken = new PaypalTokenService();
      paypalToken.then(function(response) {
        console.log(response);
        Authentication.paypal = response.data.token_type + ' ' + response.data.access_token;
      });
    }


    // Make a post request to place the bid.
    function placeBid(auction) {
      console.log(user.bidTotal);
      console.log(auction.amount);
      if (!user) {
        if (window.confirm('You need to register to bid on Auctions! Click "OK" to create an account.')) {
          window.location.href='http://localhost:3000/authentication/signup';
        }
        return;
      }
      if (!user.address || !user.region) {
        if (window.confirm('You need to enter a Shipping Address! Click "OK" to enter a shipping address')) {
          window.location.href='http://localhost:3000/settings/profile';
        }
        return;
      }
      // Before a bid is placed, we should compare the user's current total to the user's authorized amount. If it doesn't surpass the threshold, we should prompt the user to approve a new authorization.
      // TODO: Updating user authorization total should eventually be moved to server-side as middleware. !!! IMPORTANT !!!
      if (user.paymentAuth.amount < (user.bidTotal + THRESHOLD)) {
        // Request new authorization amount.
        newAuthAmt = (user.authorizedAmount + (THRESHOLD)).toFixed(2);
        console.log(newAuthAmt);
        paymentAuth = new PaymentAuthService({ 'data' : { 'transactions': [
          {
            'amount' : {
              'total' : newAuthAmt,
              'currency' : 'USD',
              'details' : {
                'subtotal' : newAuthAmt
              }
            },
            'description' : 'This is to authorize an amount of '+newAuthAmt,
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
          // TODO: Save the user's new auth amount, and place the bid if we've authorized enough.
          var transactions = response.data.transactions[0];
          // user.authorizedAmount = Number(transactions.amount.total);
          // user.currentPaymentID = response.data.id;
          user.paymentAuth.date = Date(response.data.create_time);
          user.paymentAuth.amount = transactions.amount.total;
          user.paymentAuth.id = response.data.id;

          updateUserProfile(user);
          placeBid(auction);
        });
      }
      else {
        // Place the bid.
        $http({
          method : 'POST',
          url : 'api/auctions/' + auction._id + '/bids'
        }).then(function(response) {
          console.log(response);
          user.bidTotal += response.data.amount;
          updateUserProfile(user);
        });
      }
    }
    // Get the current leading bid
    function getCurrent(auction) {
      $http.get('/api/bids/'+auction._id+'/leading').then(function(response) {
        auction.amount = response.data ? response.data.amount.toFixed(2) : 1.00;
        auction.leader = response.data ? response.data.user.displayName : '';
        auction.currentUser = $scope.userName;
      });

    }

    // Update a user profile
    // Updating authorization amount should eventually be handled server-side.
    function updateUserProfile(user) {
      $scope.success = $scope.error = null;
      console.log('inside updateUserProfile', user);
      user = new Users(user);

      user.$update(function (response) {
        $scope.success = true;
        Authentication.user = response;
        console.log('response on saving user: ', response);
      }, function (response) {
        $scope.error = response.data.message;
      });
    }
    // For each auction, get the current leading bid.
    var bidUpdate = window.setInterval(function() {
      vm.auctions.forEach(function(auction) {
        getCurrent(auction);
      });
    }, updatePeriod);

    $scope.$on('$destroy',function() {
      window.clearInterval(bidUpdate);
    });
  }
})();
