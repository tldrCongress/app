'use strict';

/**
 * @ngdoc function
 * @name hack4CongressApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the hack4CongressApp
 */
app.controller('DashboardCtrl', function ($scope, $http) {

	// Initialize these objects
	$scope.rep = {};
	$scope.votes = {};

	$scope.score = 67; // (int) Percentage matching
	$scope.direction = 1; //1 = improving score, -1 decreasing score, 0 = neutral

	// Load the json data for intersts
  $http.get('/data/profile.json')
    .success(function(d) {
      $scope.rep = d;
    })
    .error(function(data, status, error, config){
      $scope.rep = [{heading:"Error",description:"Could not load json   data"}];
    });

  // json data directly from govtrack
	$http.get('https://www.govtrack.us/api/v2/person/300043')
		.success(function(d) {
			$scope.repInfo = d;
      console.log($scope.repInfo);
		})
		.error(function(data, status, error, config){
			$scope.repInfo = [{heading:"Error",description:"Could not load json   data"}];
		});


	// Load the voting record
	// $http.get('/data/record.json')
	// 	.success(function(d) {
	// 		$scope.votes = d;
	// 	})
	// 	.error(function(data, status, error, config){
	// 		$scope.votes = [{heading:"Error",description:"Could not load json   data"}];
	// 	});

  // Load the voting record
  $http.get('/data/record.json')
   .success(function(d) {
     $scope.comments = d;
     console.log($scope.comments);
   })
   .error(function(data, status, error, config){
     $scope.comments = [{heading:"Error",description:"Could not load json   data"}];
   });

  // Load data from govtrack.
  $http.get('https://www.govtrack.us/api/v2/vote_voter?person=300043&order_by=-created')
    .success(function(votes) {
      $scope.votes = votes.objects;
      console.log($scope.votes);
      console.log($scope.votes[0].option.key);
    })
    .error(function(data, status, error, config){
      $scope.votes = [{heading:"Error", description:"Could not load json data for votes"}];
    });
});