'use strict';

/**
 * @ngdoc overview
 * @name hack4CongressApp
 * @description
 * # hack4CongressApp
 *
 * Main module of the application.
 */
var app = angular.module('hack4CongressApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl'
      })
      .when('/interests', {
        templateUrl: 'views/interests.html',
        controller: 'InterestsCtrl'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

  app.controller("hack4CongressCtrl", function($scope, $firebaseObject) {
    var ref = new Firebase("https://blistering-inferno-7388.firebaseio.com/");

    // download the data into a local object
    $scope.data = $firebaseObject(ref);
  });
