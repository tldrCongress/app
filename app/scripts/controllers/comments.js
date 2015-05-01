'use strict';

/**
 * @ngdoc function
 * @name hack4CongressApp.controller:CommentsCtrl
 * @description
 * # CommentsCtrl
 * Controller of the hack4CongressApp
 */
app.factory('Comments', ['$firebaseObject', "$firebaseAuth",
    function($firebaseObject, $firebaseAuth) {
        var url = 'https://blistering-inferno-7388.firebaseio.com/events/';
        var ref = new Firebase(url);
        return $firebaseObject(ref);
    }
])
app.controller('CommentsCtrl', ['$scope', '$location', '$http', 'Comments',
    function ($scope, $location, $http, Comments) {
        // Initialize these objects
        $scope.interestTags = ["tag0","tag1"];
        $scope.newTag = '';
        $scope.comments = '';
        $scope.newComment = Comments;
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

        $scope.goto = function(u)
        {
            window.open(u, '_blank');
        }

        $scope.addTag = function(p) {
            console.log('adding tag');
            $scope.interestTags.push(p);
            $scope.newTag = '';
        };
        $scope.removeTag = function(i) {
            if (i > -1) { $scope.interestTags.splice(i, 1); }
        };

        $scope.editComment = function() {
            console.log('click!')
        }
        $scope.addComment = function() {
            console.log('click!')
        }

        // create the new issue in Firebase
        $scope.saveComment = function()
        {
            $scope.newComment.comments = $scope.comments;
            $scope.newComment.tags = $scope.interestTags;

            $scope.newComment.$save().then(function() {
                var eventId = $scope.newComment.$id;
                alert('Success!');
            }).catch(function(error) {
                alert('Oh no! Something went wrong!');
            });
        }
    }
]);