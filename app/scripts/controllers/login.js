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
              console.log('email invalid');
            } else if (error = 'INVALID_PASSWORD') {
              console.log('wrong password!');
            } else {
              console.log(error);
            }
          });
        }
}]);