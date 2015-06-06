'use strict';

/**
 * @ngdoc function
 * @name hack4CongressApp.controller:AllowedStaffersCtrl
 * @description
 * # AllowedStaffersCtrl
 * Controller of the hack4CongressApp
 */
app.controller('AllowedStaffersCtrl', ['ContentCreators', '$filter',
function ($scope, $http, $location, ContentCreators, $filter) {
  $scope.curRep = 300043; // HARD CODED PERSON ID
  $scope.staffers = [];
  $scope.location = $location.path();
  ContentCreators.$loaded().then(function() {
    $scope.staffers = []; // IMPLEMENT ME
  });
}]);