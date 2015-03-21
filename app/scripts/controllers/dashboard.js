'use strict';

/**
 * @ngdoc function
 * @name hack4CongressApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the hack4CongressApp
 */
angular.module('hack4CongressApp')
  .controller('DashboardCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
