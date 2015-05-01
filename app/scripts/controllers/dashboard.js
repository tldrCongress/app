'use strict';

/**
 * @ngdoc function
 * @name hack4CongressApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the hack4CongressApp
 */
app.controller('DashboardCtrl', function ($scope, $http, $location, $firebaseObject) {

	// Initialize these objects
	$scope.rep = {}; // Data for the current elected official
	$scope.votes = {}; // Voting record of the current elected official
	$scope.myReps = {}; // List of user's representatives (house, senate, etc...)
	$scope.myInterests = {}; // Object that defines the user's interests
	$scope.data = [];
	$scope.curRep = 0;
	$scope.searchMode = false;

	$scope.location = $location.path();

    $scope.currdeg = 0; // Current position of carousel

	$scope.goto = function(u)
	{
		window.open(u, '_blank');
	}

	// Load the json data for intersts
	$http.get('/data/profile.json')
    .success(function(d) {
      $scope.rep = d;
    })
    .error(function(data, status, error, config){
      $scope.rep = [{heading:"Error",description:"Could not load json   data"}];
    });


	//Load the user's reps
	$http.get('/data/myReps.json')
    .success(function(d) {
		$scope.myReps = d;
		$scope.getRepData();
    })
    .error(function(data, status, error, config){
		$scope.rep = [{heading:"Error", description:"Could not load json   data"}];
    });


	// json data directly from govtrack
	$scope.getRepData = function(){

		//Get the rep info
		$scope.repInfo = {};
		$http.get('https://www.govtrack.us/api/v2/person/'+$scope.myReps[$scope.curRep].id)
		.success(function(d) {
			$scope.repInfo = d;
		})
		.error(function(data, status, error, config){
			$scope.repInfo = [{heading:"Error",description:"Could not load json   data"}];
		});

		// Load their voting record
		$scope.votes = {};
		$http.get('https://www.govtrack.us/api/v2/vote_voter?person=300043&order_by=-created')
		.success(function(v) {
			$scope.votes = v.objects;
			var govtrackData = v.objects;
			govtrackData.forEach(function(element) {
				var voteData = element.vote;
				voteData['voteValue'] = element.option.value;
				voteData['comment'] = 'Hard-coded placeholder comment on why this representative voted this way. Hook up the voteID from govtrack to voteID comment inside firebase';
				$scope.data.push(voteData);
			});
		})
		.error(function(data, status, error, config){
			$scope.votes = [{heading:"Error", description:"Could not load json data for votes"}];
		});

	}

	// Change the nav bar to search
	$scope.setSearching = function(t) { $scope.searchMode=t;	};


	// Carousel control functions
	$scope.nextPerson = function(){ $scope.rotate('n'); }
	$scope.prevPerson = function(){ $scope.rotate('p'); }
	$scope.rotate = function(d){
		if(d=="n"){
			$scope.currdeg = $scope.currdeg - 60;
			$scope.curRep++;
		}
		if(d=="p"){
			$scope.currdeg = $scope.currdeg + 60;
			$scope.curRep--;
		}
		if($scope.curRep > $scope.myReps.length){ $scope.curRep=0; }
		$scope.data = $scope.getRepData(); //Update the rep's info in the background

		$('#officialCarousel .carousel').css({
			"-webkit-transform": "rotateY("+$scope.currdeg+"deg)",
			"-moz-transform": "rotateY("+$scope.currdeg+"deg)",
			"-o-transform": "rotateY("+$scope.currdeg+"deg)",
			"transform": "rotateY("+$scope.currdeg+"deg)"
		});
	}
});