'use strict';

/**
 * @ngdoc function
 * @name hack4CongressApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the hack4CongressApp
 */
app.controller('AboutCtrl', function ($scope, $location, $http) {

	$scope.location = $location.path();

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
});