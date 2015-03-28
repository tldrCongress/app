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
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl'
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
      .when('/mySettings', {
        templateUrl: 'views/mysettings.html',
        controller: 'MysettingsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
