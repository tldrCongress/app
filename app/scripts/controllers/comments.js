'use strict';

/**
 * @ngdoc function
 * @name hack4CongressApp.controller:CommentsCtrl
 * @description
 * # CommentsCtrl
 * Controller of the hack4CongressApp
 */
app.factory('StafferComments', ['$firebaseObject', "$firebaseAuth",
    function($firebaseObject, $firebaseAuth) {
        var url = 'https://blistering-inferno-7388.firebaseio.com/StafferComments/';
        var ref = new Firebase(url);
        return $firebaseObject(ref);
    }
])
app.controller('CommentsCtrl', ['$scope', '$location', '$http', 'StafferComments',
    function ($scope, $location, $http, StafferComments) {
        StafferComments.$loaded().then(function() {
            // Initialize these objects
            $scope.interestTags = ["tag0","tag1"];
            $scope.newTag = '';
            $scope.comments = StafferComments;
            $scope.rep = {}; // Data for the current elected official
            $scope.votes = {}; // Voting record of the current elected official
            $scope.myReps = {}; // List of user's representatives (house, senate, etc...)
            $scope.data = [];
            $scope.curRep = 0;
            $scope.searchMode = false;

            $scope.location = $location.path();
            $scope.currdeg = 0; // Current position of carousel

            // NOTE: this is repetitive data from dashboard.js
            // TODO: either merge this with dashboard.js and display different data
            // if the user is authenticated as a staffer
            // OR keep this in a permanent state of being a separate page, but 
            // clean-up the logic so it's not duplicated

            //Load the user's reps
            $http.get('/data/myReps.json')
            .success(function(d) {
                $scope.myReps = d;
                $scope.getRepData();
            })
            .error(function(data, status, error, config){
                $scope.rep = [{heading:"Error", description:"Could not load json data"}];
            });
            // json data directly from govtrack
            $scope.getRepData = function(){
                $scope.data.loaded = false;
                //Get the rep info
                $scope.repInfo = {};
                $http.get('https://www.govtrack.us/api/v2/person/'+$scope.myReps[$scope.curRep].id)
                .success(function(d) {
                    $scope.repInfo = d;
                })
                .error(function(data, status, error, config){
                    $scope.repInfo = [{heading:"Error",description:"Could not load json data"}];
                });

                // Load their voting record
                $scope.votes = {};
                $http.get('https://www.govtrack.us/api/v2/vote_voter?person=' +$scope.myReps[$scope.curRep].id +'&order_by=-created')
                .success(function(v) {
                    $scope.votes = v.objects;
                    var govtrackData = v.objects;
                    var comments = $scope.comments;
                    govtrackData.forEach(function(element) {
                        var personId = element.person.id;
                        var voteId = element.vote.id;
                        var voteData = element.vote;
                        var commentsOnIssue = $scope.comments[voteId];
                        voteData['comment'] = commentsOnIssue ? commentsOnIssue[personId] : '';
                        voteData['editing'] = commentsOnIssue ? false : true;
                        voteData['voteValue'] = element.option.value;
                        voteData['personId'] = personId;
                        $scope.data.push(voteData);
                    });
                    $scope.data.loaded = true;
                })
                .error(function(data, status, error, config){
                    $scope.votes = [{heading:"Error", description:"Could not load json data for votes"}];
                });

            }

            $scope.goto = function(u)
            {
                window.open(u, '_blank');
            }

            $scope.editComment = function(index, thisVote) {
                $scope.data[index].editing = true;
            }
            $scope.addComment = function(index, thisVote) {
                var voteId = thisVote.id;
                var personId = thisVote.personId;
                $scope.data[index].editing = false;
                $scope.comments[voteId] = {};
                $scope.comments[voteId][personId] = $scope.data[index].comment;
                $scope.comments.$save().then(function() {
                    console.log('Success!');
                });
            }
        });
    }
]);