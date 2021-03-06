'use strict';

/**
 * @ngdoc function
 * @name hack4CongressApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the hack4CongressApp
 */

app.controller('DashboardCtrl', ['$scope', '$filter', '$location', '$http', 'StafferComments',
 function ($scope, $filter, $location, $http, StafferComments) {

  StafferComments.$loaded().then(function() {
    // Initialize these objects
    $scope.comments = StafferComments;
    $scope.rep = {}; // Data for the current elected official
    $scope.votes = {}; // Voting record of the current elected official
    $scope.myReps = {}; // List of user's representatives (house, senate, etc...)
    $scope.data = [];
    $scope.curRep = 0;

    $scope.location = $location.path();
    $scope.currdeg = 0; // Current position of carousel

    //Load the user's reps
    $http.get('/data/myReps.json')
    .success(function(d) {
      $scope.myReps = d;
      $scope.getRepData();
    })
    .error(function(data, status, error, config){
      $scope.rep = [{heading:"Error", description:"Could not load json   data"}];
    });

    // json data from govtrack
    $scope.getRepData = function(){
      $scope.data.loaded = false;
      //Get the rep info
      $scope.repInfo = {};
      $http.get('https://www.govtrack.us/api/v2/person/'+$scope.myReps[$scope.curRep].id)
      .success(function(d) {
        $scope.repInfo = d;
      })
      .error(function(data, status, error, config){
        $scope.repInfo = [{heading:"Error", description:"Could not load json   data"}];
      });

      // Load their voting record
      $scope.votes = {};
      $http.get('https://www.govtrack.us/api/v2/vote_voter?person=300043&order_by=-created')
      .success(function(v) {
        $scope.votes = v.objects;
        var govtrackData = v.objects;
        // Get all the person's comments
        // Or initialize it to Null
        var personId = 300043; // HARD CODED
        var commentsByPerson = $scope.comments[personId] ? $scope.comments[personId] : {};
        govtrackData.forEach(function(element) {
            var personId = element.person.id;
            var voteId = element.vote.id;
            var voteData = element.vote;
            var numEdits = commentsByPerson[voteId] ? commentsByPerson[voteId].length : 0;

            var comments = numEdits > 0 ? $filter('orderBy')(commentsByPerson[voteId], 'datetime', true) : [];
            // Get the person's comment on the issue that we're looking at
            voteData['comment'] = numEdits > 0 ? comments[0] : '';
            voteData['edited'] = numEdits > 1 ? true : false;
            // voteData['editHistory'] = null;
            voteData['personId'] = personId;
            
            voteData['voteValue'] = element.option.value;
            voteData['url'] = element.vote.link;
            $scope.data.push(voteData);
        });
        $scope.data.loaded = true;
    })
      .error(function(data, status, error, config){
        $scope.votes = [{heading:"Error", description:"Could not load json data for votes"}];
      });

    };

    $scope.showEditHistory = function(index, thisVote)
    {
      // format:
      // [{comment: comment, datetime: datetime}, {comment: comment, datetime: datetime},... {comment: comment, datetime: datetime}]
      $scope.data[index]['editHistory'] = $scope.comments[thisVote.personId][thisVote.id];
    }

    $scope.goto = function(u){ window.open(u, '_blank'); };


    // Carousel control functions
    $scope.nextPerson = function(){ $scope.rotate('n'); };
    $scope.prevPerson = function(){ $scope.rotate('p'); };
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
    };

  }); //END: StafferComments.$loaded()

}]);