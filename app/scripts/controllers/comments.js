'use strict';

/**
 * @ngdoc function
 * @name hack4CongressApp.controller:CommentsCtrl
 * @description
 * # CommentsCtrl
 * Controller of the hack4CongressApp
 */

app.controller('CommentsCtrl', ['$scope', '$location', '$http', 'StafferComments', 'Auth',
  function ($scope, $location, $http, StafferComments, Auth) {

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
            $http.get('https://www.govtrack.us/api/v2/vote_voter?person=300043&order_by=-created')
            .success(function(v) {
                $scope.votes = v.objects;
                var govtrackData = v.objects;
                var comments = $scope.comments;
                // Get all the person's comments
                // Or initialize it to Null
                var personId = 300043; // HARD CODED PERSON ID
                var commentsByPerson = $scope.comments[personId] ? $scope.comments[personId] : {};
                govtrackData.forEach(function(element) {
                    var voteId = element.vote.id;
                    var voteData = element.vote;

                    // Get the person's comment on the issue that we're looking at
                    var comment = commentsByPerson[voteId] ? commentsByPerson[voteId][0] : '';
                    voteData['comment'] = comment;

                    // Allow for easy editing if there is no comment for this issue
                    voteData['editing'] = comment ? false : true;
                    voteData['voteValue'] = element.option.value;
                    voteData['personId'] = personId;
                    voteData['url'] = element.vote.link;
                    $scope.data.push(voteData);
                });
                $scope.data.loaded = true;
            })
            .error(function(data, status, error, config){
                $scope.votes = [{heading:"Error", description:"Could not load json data for votes"}];
            });
        };

        $scope.login = function () {
          Auth.$authWithPassword({
            email: $scope.email,
            password: $scope.password
          }).then(function(authData) {
            $scope.authData = authData;
          }, function(error) {
            if (error = 'INVALID_EMAIL') {
              console.log('email invalid');
            } else if (error = 'INVALID_PASSWORD') {
              console.log('wrong password!');
            } else {
              console.log(error);
            }
          });
        }

        // any time auth status updates, add the user data to scope
        Auth.$onAuth(function(authData) {
          $scope.authData = authData;
        });
        
        $scope.goto = function(u) { window.open(u, '_blank'); };

        $scope.editComment = function(index, thisVote) { $scope.data[index].editing = true; };

        $scope.addComment = function(index, thisVote) {
            if ($scope.authData) {
                var voteId = thisVote.id;
                var personId = thisVote.personId;
                $scope.data[index].editing = false;
                if (!$scope.comments[personId]) {
                    $scope.comments[personId] = {};
                }
                var comment = $scope.data[index].comment.content;
                var datetime = Firebase.ServerValue.TIMESTAMP;
                if (!$scope.comments[personId][voteId]) {
                    $scope.comments[personId][voteId] = [];
                }
                $scope.comments[personId][voteId].unshift({'content': comment, 'datetime': datetime});
                $scope.comments.$save().then(function() {
                    console.log('Success!');
                });
            } else {
                console.log('Not authenticated')
            }
        };

    }); //END: StafferComments.$loaded()

}]);