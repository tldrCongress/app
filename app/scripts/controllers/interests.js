'use strict';

/**
 * @ngdoc function
 * @name hack4CongressApp.controller:InterestCtrl
 * @description
 * # InterestCtrl
 * Controller of the hack4CongressApp
 */
app.controller('InterestsCtrl', function ($scope, $http, Interests, VoterInterests, Voter ) {

    var vid = 'v001'; // HARD CODED FOR NOW
    $scope.voter = Voter.get(vid);
    $scope.interests = Interests.get();

    // TODO: GET RID OF THIS
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
        VoterInterests.save(vid, $scope.interests);
    }

});