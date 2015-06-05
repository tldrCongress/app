'use strict';

/**
 * @ngdoc function
 * @name hack4CongressApp.controller:CommentsCtrl
 * @description
 * # CommentsCtrl
 * Controller of the hack4CongressApp
 */

app.controller('UpcomingBillsCtrlInternal', ['$scope', '$location', '$http', 'StafferCommentsUpcoming', '$filter',
  function ($scope, $location, $http, StafferCommentsUpcoming, $filter) {

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

  }); //END: StafferCommentsUpcoming.$loaded()

}]);