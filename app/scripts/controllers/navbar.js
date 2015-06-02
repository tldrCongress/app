'use strict';

/**
 * @ngdoc function
 * @name hack4CongressApp.controller:NavBar
 * @description
 * # NavBarCtrl
 * Controller of the hack4CongressApp
 */

app.controller('NavBarCtrl', ['$scope', '$location', 'Auth',
  function ($scope, $location, Auth) {
    // any time auth status updates, add the user data to scope
    Auth.$onAuth(function(authData) {
      $scope.authData = authData;
    });
    $scope.logout = function () {
        $location.path('/dashboard');
        Auth.$unauth();
    }
}]);