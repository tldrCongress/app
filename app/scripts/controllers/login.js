'use strict';

/**
 * @ngdoc function
 * @name hack4CongressApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the hack4CongressApp
 */
app.controller('LoginCtrl', ['$scope', '$location', '$http',
    function ($scope, $location, $http) {
        $scope.email = '';
        $scope.password = '';

        $scope.login = function() {
            var ref = new Firebase("https://blistering-inferno-7388.firebaseio.com");
            ref.authWithPassword({
                email    : $scope.email,
                password : $scope.password
            }, function(error, authData) {
                if (error) {
                    console.log("Login Failed!", error);
                } else {
                    console.log("Authenticated successfully with payload:", authData);
                    $location.path("issueCreation");
                }
            });
        }
    }
]);