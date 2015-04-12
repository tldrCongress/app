'use strict';

/**
 * @ngdoc function
 * @name hack4CongressApp.controller:IssueCreationCtrl
 * @description
 * # IssueCreationCtrl
 * Controller of the hack4CongressApp
 */
app.factory('Events', ['$firebaseObject', 'dataShare',
    function($firebaseObject, dataShare) {
        if (dataShare.eventId == undefined) {
            var eventId = new Date().getTime(); //Math.round(Math.random() * 100000000);
            // console.log(eventId);
        } else {
            var eventId = dataShare.eventId;
        }
        var url = 'https://blistering-inferno-7388.firebaseio.com/events/' + eventId;
        var ref = new Firebase(url);
        return $firebaseObject(ref);
    }
])
app.controller('IssueCreationCtrl', ['$scope', '$location', '$http', 'Events', 'dataShare',
    function ($scope, $location, $http, Events, dataShare) {
        $scope.title = '';
        $scope.content = '';
        $scope.interestTags = ["tag0","tag1"];
        $scope.newTag = '';
        $scope.comments = '';
        $scope.newEvent = Events;

        $scope.addTag = function(p) {
            console.log('adding tag')
            $scope.interestTags.push(p);
            $scope.newTag = '';
        };
        $scope.removeTag = function(i) {
            if (i > -1) { $scope.interestTags.splice(i, 1); }
        };

        // create the new issue in Firebase
        $scope.saveEvent = function()
        {
            $scope.newEvent.title = $scope.title;
            $scope.newEvent.content = $scope.content;
            $scope.newEvent.created = $scope.comments;
            $scope.newEvent.comments = $scope.comments;
            $scope.newEvent.tags = $scope.interestTags;

            $scope.newEvent.$save().then(function() {
                var eventId = $scope.newEvent.$id;
                dataShare.set({'eventId': eventId});
                alert('Success!');
            }).catch(function(error) {
                alert('Oh no! Something went wrong!');
            });
        }
    }
]);