'use strict';

/**
 * @ngdoc function
 * @name hack4CongressApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the hack4CongressApp
 */
app.controller('DashboardCtrl', function ($scope, $http) {

	$scope.rep = {};

	// Load the json data for intersts
	$http.get('/data/profile.json')
		.success(function(data) {
			$scope.rep = data;
		})
		.error(function(data, status, error, config){
			$scope.rep = [{heading:"Error",description:"Could not load json   data"}];
		});

});