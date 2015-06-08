'use strict';

/**
 * @ngdoc function
 * @name hack4CongressApp.controller:CommentsCtrl
 * @description
 * # CommentsCtrl
 * Controller of the hack4CongressApp
 */

app.controller('CommentsCtrl', ['$scope', '$location', '$http', 'StafferComments', 'Auth', '$filter', 'ContentCreators',
  function ($scope, $location, $http, StafferComments, Auth, $filter, ContentCreators) {

  StafferComments.$loaded().then(function() {
    // Initialize these objects
    $scope.comments = StafferComments;
    $scope.rep = {}; // Data for the current elected official
    $scope.votes = {}; // Voting record of the current elected official
    $scope.myReps = {}; // List of user's representatives (house, senate, etc...)
    $scope.data = [];
    $scope.curRep = 300043; // HARD CODED PERSON ID

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
      console.log($scope.myReps)
      $http.get('https://www.govtrack.us/api/v2/person/'+$scope.myReps[0].id)
      .success(function(d) {
        $scope.repInfo = d;
      })
      .error(function(data, status, error, config){
        $scope.repInfo = [{heading:"Error",description:"Could not load json data"}];
      });

      // CHANGE ME
      var personId = 300043; // HARD CODED PERSON ID

      // Load their voting record
      $scope.votes = {};
      $http.get('https://www.govtrack.us/api/v2/vote_voter?person=' + personId + '&order_by=-created')
      .success(function(v) {
        $scope.votes = v.objects;
        var govtrackData = v.objects;
        // Get all the person's comments
        // Or initialize it to Null
        var personId = 300043; // HARD CODED PERSON ID
        var commentsByPerson = $scope.comments[personId] ? $scope.comments[personId] : {};
        govtrackData.forEach(function(element) {
          var voteId = element.vote.id;
          var voteData = element.vote;

          var numEdits = commentsByPerson[voteId] ? commentsByPerson[voteId].length : 0;
          var comments = numEdits > 0 ? $filter('orderBy')(commentsByPerson[voteId], 'datetime', true) : [];
          
          // Get the person's comment on the issue that we're looking at
          voteData['comment'] = numEdits > 0 ? comments[0] : '';

          // Allow for easy editing if there is no comment for this issue
          voteData['editing'] = numEdits > 0 ? false : true;
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

    // any time auth status updates, add the user data to scope
    Auth.$onAuth(function(authData) {
      if (authData == null) {
        $location.path('/login');
      } else {
        $scope.authData = authData;
        ContentCreators.$loaded().then(function() {
          $scope.electedId = ContentCreators[authData.uid].elected;
          console.log($scope.electedId)
          // if they're logged in but viewing a different representative's info
          // direct them to the dashboard
          if ($scope.electedId != $scope.curRep) {
            $location.path('/dashboard');
          }
        });
      }
    });
    
    $scope.goto = function(u) { window.open(u, '_blank'); };

    $scope.editComment = function(index, thisVote) { $scope.data[index].editing = true; };

    $scope.addComment = function(index, thisVote) {
      if($scope.authData){
        if ($scope.electedId == thisVote.personId) {
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
          alert('You do not have permission to add comments for this representative.');
        }
      } else {
        alert('Please login to add comments');
      }
    };

  }); //END: StafferComments.$loaded()

}]);