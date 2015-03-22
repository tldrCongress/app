'use strict';

/**
 * @ngdoc function
 * @name hack4CongressApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the hack4CongressApp
 */
app.controller('RegisterCtrl', function ($scope, Voter) {

	// Registers the user (via email)
    $scope.register = function(){
    	// create a voter_id that's v suffixed with the current timestamp
    	var vid = 'v' + new Date().getTime().toString();
    	var email = $("input[name=email]").val();
    	var zip = $("input[name=zip]").val();
		var vid = Voter.create(vid, email, zip);
	}
});