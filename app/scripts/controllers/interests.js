'use strict';

/**
 * @ngdoc function
 * @name hack4CongressApp.controller:InterestCtrl
 * @description
 * # InterestCtrl
 * Controller of the hack4CongressApp
 */
app.controller('InterestsCtrl', function ($scope, $http) {

    $scope.interests = {};

	// Load the json data for intersts
	$http.get('/data/interests.json')
        .success(function(data) {
            $scope.interests = data;
        })
        .error(function(data, status, error, config){
            $scope.interests = [{heading:"Error",description:"Could not load json   data"}];
		});

	// Updates the user's interest settings, i = interest number in array
	$scope.toggleInterest = function(i)
	{
		$scope.interests[i].support = !$scope.interests[i].support;
	}

});