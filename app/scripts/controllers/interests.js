'use strict';

/**
 * @ngdoc function
 * @name hack4CongressApp.controller:InterestCtrl
 * @description
 * # InterestCtrl
 * Controller of the hack4CongressApp
 */

app.factory('Interests', ['$firebaseArray',
    function($firebaseArray) {
        var url = 'https://blistering-inferno-7388.firebaseio.com/interests';
        var ref = new Firebase(url);
        return $firebaseArray(ref);
    }
])
app.controller('InterestsCtrl', ["$scope", "Interests", 
    function($scope, Interests) {
        Interests.$loaded().then(function() {
            $scope.interests = Interests;
            // Updates the user's interest settings, i = interest number in array
            $scope.toggleInterest = function(i,j)
            {
                $scope.interests[i].data[j].support = !$scope.interests[i].data[j].support;
                $scope.interests.$save(i)
            }
        })
    }
]);