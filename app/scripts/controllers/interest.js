'use strict';

/**
 * @ngdoc function
 * @name hack4CongressApp.controller:InterestCtrl
 * @description
 * # InterestCtrl
 * Controller of the hack4CongressApp
 */
app.controller('InterestCtrl', function ($scope) {

    $scope.intersts = {};

	// Load the json data for intersts
	$http.get('/data/intersts.json')
        .success(function(data) {
			console.log(data);
            $scope.contents=data[0];
        })
        .error(function(data,status,error,config){
            $scope.contents = [{heading:"Error",description:"Could not load json   data"}];
		});

});