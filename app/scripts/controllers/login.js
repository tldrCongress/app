'use strict';

/**
 * @ngdoc function
 * @name hack4CongressApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the hack4CongressApp
 */
app.controller('LoginCtrl', ['$scope', '$location', '$http', 'Auth',
  function ($scope, $location, $http, Auth) {
  $scope.login = function () {
    Auth.$authWithPassword({
    email: $scope.email,
    password: $scope.password
    }).then(function(authData) {
    $scope.authData = authData;
    $location.path('/stafferDashboard');
    }, function(error) {
    if (error = 'INVALID_EMAIL') {
      alert('email invalid');
    } else if (error = 'INVALID_PASSWORD') {
      alert('wrong password!');
    } else {
      alert('Oops, something went wrong :(');
    }
    });
  }
}]);