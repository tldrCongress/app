'use strict';

/**
 * @ngdoc function
 * @name hack4CongressApp.controller:InterestCtrl
 * @description
 * # InterestCtrl
 * Controller of the hack4CongressApp
 */

app.factory('Interests', ['$firebaseArray', 'dataShare',
    function($firebaseArray, dataShare) {
        var voterId = dataShare.get().voterId;
        var urlInterests = 'https://blistering-inferno-7388.firebaseio.com/interests';
        var refInterests = new Firebase(urlInterests);
        var genericInterests = $firebaseArray(refInterests);
        
        return genericInterests;
        
    }
])
app.controller('InterestsCtrl', ["$scope", "Interests", 'dataShare', '$firebaseArray',
    function($scope, Interests, dataShare, $firebaseArray) {
        Interests.$loaded().then(function() {
            var voterId = dataShare.get().voterId;
            var urlVoterInterests = 'https://blistering-inferno-7388.firebaseio.com/voterInterests/' + voterId;
            var refVoterInterests = new Firebase(urlVoterInterests);
            var voterInterests = $firebaseArray(refVoterInterests);
            console.log(voterInterests.length)
            console.log('voterInterests', voterInterests)
            
            // populate it with generic interests if this is a new user
            if(voterInterests.length == 0) {
                $scope.genericInterests = Interests;
                $scope.genericInterests.forEach(function(interest) {
                    voterInterests.$add(interest);
                });
            }
            
            $scope.interests = voterInterests;
            // Updates the user's interest settings, i = interest number in array
            $scope.toggleInterest = function(i,j)
            {
                $scope.interests[i].data[j].support = !$scope.interests[i].data[j].support;
                $scope.interests.$save(i)
            }
        })
    }
]);