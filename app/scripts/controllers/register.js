'use strict';

/**
 * @ngdoc function
 * @name hack4CongressApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the hack4CongressApp
 */
app.controller('RegisterCtrl', ['$scope', '$http', function ($scope, $http) {

	$scope.email = '';
	$scope.zip = '';
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
	}


	// Test if form is ready to be submitted
	$scope.checkReady = function()
	{
		if($scope.email!='' && $scope.zip.length>4) { $scope.signUpReady=true; } else { $scope.signUpReady=false; }
	}


	// Registers the user (via email)
   /*$scope.register = function(){
    	// create a voter_id that's v suffixed with the current timestamp
    	var vid = 'v' + new Date().getTime().toString();
    	var email = $("input[name=email]").val();
    	var zip = $("input[name=zip]").val();
		var vid = Voter.create(vid, email, zip);
	}*/

}]);