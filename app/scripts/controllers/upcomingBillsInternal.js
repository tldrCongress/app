'use strict';

/**
 * @ngdoc function
 * @name hack4CongressApp.controller:CommentsCtrl
 * @description
 * # CommentsCtrl
 * Controller of the hack4CongressApp
 */

app.controller('UpcomingBillsCtrlInternal', ['$scope', '$location', '$http', 'StafferCommentsUpcoming', 'Auth', '$filter', 'ContentCreators',
  function ($scope, $location, $http, StafferCommentsUpcoming, Auth, $filter, ContentCreators) {

  StafferCommentsUpcoming.$loaded().then(function() {
    // Initialize these objects
    $scope.comments = StafferCommentsUpcoming;
    $scope.rep = {}; // Data for the current elected official
    $scope.votes = {}; // Voting record of the current elected official
    $scope.myReps = {}; // List of user's representatives (house, senate, etc...)
    $scope.data = [];
    $scope.curRep = 300043; // HARD CODED PERSON ID

    $scope.location = $location.path();
    $scope.currdeg = 0; // Current position of carousel

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
        $scope.repRole = $filter('filter')(d.roles, {current:true})[0].role_type;
      })
      .error(function(data, status, error, config){
        $scope.repInfo = [{heading:"Error",description:"Could not load json data"}];
      });

      // CHANGE ME
      var personId = 300043; // HARD CODED PERSON ID

      var chamber = $scope.repRole == 'senator' ? 'senate' : 'house';
      var sunlightKey = 'c261516221324552a36c3bd9fc8e5383';
      var sunlightEndpoint =
        'https://congress.api.sunlightfoundation.com/upcoming_bills?chamber=' 
        + chamber 
        + '&order=scheduled_at&apikey='
        + sunlightKey;

      $scope.bills = {};
      $http.get(sunlightEndpoint)
      .success(function(bills) {
        $scope.bills = sunlightData = bills.results;
        sunlightData.forEach(function(bill) {
          billData['id'] = bill.bill_id;
          billData['url'] = bill.bill_url;
          billData['description'] = bill.description;
          billData['date'] = bill.legislative_day;

          var numEdits = commentsByPerson[bill.bill_id] ? commentsByPerson[bill.bill_id].length : 0;
          billData['comment'] = numEdits > 0 ? comments[0].comment : '';

          $scope.data.push(billData);
        });
        $scope.data.loaded = true;
      })
      .error(function(bills, status, error, config) {
        $scope.bills = [{heading:"Error", description:"Could not load json data for votes"}]
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
          // if they're logged in but viewing a different representative's info
          // direct them to the dashboard
          if ($scope.electedId != $scope.curRep) {
            $location.path('/upcomingBills');
          }
        });
      }
    });

    $scope.toggleVote = function(index, thisBill) {
      console.log('toggle!')
    }
    $scope.editComment = function(index, thisBill) { $scope.data[index].editing = true; };

    $scope.addComment = function(index, thisBill) {
      if ($scope.authData) {
        var voteId = thisBill.id;
        var personId = thisBill.personId;
        $scope.data[index].editing = false;
        if (!$scope.comments[personId]) {
          $scope.comments[personId] = {};
        }
        var comment = $scope.data[index].comment.content;
        var datetime = Firebase.ServerValue.TIMESTAMP;
        var voteValue = $scope.data[index].comment.voteValue;
        
        if (!$scope.comments[personId][voteId]) {
          $scope.comments[personId][voteId] = [];
        }
        $scope.comments[personId][voteId].unshift(
          {'content': comment, 'datetime': datetime, 'voteValue': voteValue}
        );
        $scope.comments.$save().then(function() {
          console.log('Success!');
        });
      } else {
        alert('Please log in to add comments');
      }
    };

  }); //END: StafferCommentsUpcoming.$loaded()

}]);