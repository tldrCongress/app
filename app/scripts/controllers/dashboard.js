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
	$scope.votes = {};

	// Load the json data for intersts
	$http.get('/data/profile.json')
		.success(function(d) {
			$scope.rep = d;
		})
		.error(function(data, status, error, config){
			$scope.rep = [{heading:"Error",description:"Could not load json   data"}];
		});


	// Load the voting record
	$http.get('/data/record.json')
		.success(function(d) {
			$scope.votes = d;
		})
		.error(function(data, status, error, config){
			$scope.votes = [{heading:"Error",description:"Could not load json   data"}];
		});
});