'use strict';

/**
 * @ngdoc function
 * @name hack4CongressApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the hack4CongressApp
 */

app.controller('RegisterCtrl', ['$scope', '$location', '$http', 'Voter', 'dataShare', function ($scope, $location, $http, Voter, dataShare) {
	$scope.email = '';
	$scope.zip = '';
	$scope.profile = Voter;

	$scope.signUpReady = false;


	// Attempt to get the user's zip code
	$scope.getUserZip = function()
	{
		window.navigator.geolocation.getCurrentPosition(function(pos){
			console.log(pos);
			$http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+pos.coords.latitude+','+pos.coords.longitude+'&sensor=true').then(function(res){
				console.log(res.data.results[0].formatted_address);
				//$zipcode = preg_match("/\b[A-Z]{2}\s+\d{5}(-\d{4})?\b/", $address, $matches);
				var myRe = /\b\d{5}(-\d{4})?\b/;
				var matches = myRe.exec(res.data.results[0].formatted_address);
				$scope.zip = matches[0];
			});
		})
	};


	// Test if form is ready to be submitted
	$scope.checkReady = function()
	{
		if($scope.email!='' && $scope.zip.length>4) { $scope.signUpReady=true; } else { $scope.signUpReady=false; }
	};

	// create the user in Firebase
	$scope.saveUser = function()
	{
		$scope.profile.email = $scope.email;
		$scope.profile.zip = $scope.zip;
		$scope.profile.$save().then(function() {
			$location.path('interests');
			var voterId = $scope.profile.$id;
			dataShare.set({'voterId': voterId});
		}).catch(function(error) {
			alert('Oh no! Something went wrong!');
		});
	};

}]);
