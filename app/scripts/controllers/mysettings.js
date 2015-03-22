'use strict';

/**
 * @ngdoc function
 * @name hack4CongressApp.controller:MysettingsCtrl
 * @description
 * # MysettingsCtrl
 * Controller of the hack4CongressApp
 */
app.controller('MysettingsCtrl', function ($scope, $http) {

    $scope.settings = {};

	// Update the user's settings
	$scope.toggleSetting = function(i)
	{
		$scope.settings[i].enabled = !$scope.settings[i].enabled;
	}

	// Load the user's settings; d = data
	$http.get('/data/settings.json')
		.success(function(d) {
			$scope.settings = d;
		})
		.error(function(data, status, error, config){
			$scope.settings = [{heading:"Error",description:"Could not load json   data"}];
		});
});