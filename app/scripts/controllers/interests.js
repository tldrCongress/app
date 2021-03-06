'use strict';

/**
 * @ngdoc function
 * @name hack4CongressApp.controller:InterestCtrl
 * @description
 * # InterestCtrl
 * Controller of the hack4CongressApp
 */


app.controller('InterestsCtrl', ["$scope", "Interests", 'dataShare', '$firebaseArray', function($scope, Interests, dataShare, $firebaseArray) {
	Interests.$loaded().then(function() {
		var voterId = dataShare.get().voterId;
		var urlVoterInterests = 'https://blistering-inferno-7388.firebaseio.com/voterInterests/' + voterId;
		var refVoterInterests = new Firebase(urlVoterInterests);
		var voterInterests = $firebaseArray(refVoterInterests);
		
		// populate it with generic interests ONLY if this is a new user
		refVoterInterests.once('value', function(snapshot) {
			var count = 0;
			snapshot.forEach(function(childSnapshot) {
				count++;
			});
		 	if(count == 0) {
				$scope.genericInterests = Interests;
				$scope.genericInterests.forEach(function(interest) {
					voterInterests.$add(interest);
				});
			}
		});
		
		function debounce(func, wait, immediate) {
			var timeout;
			return function() {
				var context = this, args = arguments;
				var later = function() {
					timeout = null;
					if (!immediate) func.apply(context, args);
				};
				var callNow = immediate && !timeout;
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
				if (callNow) func.apply(context, args);
			};
		};

		voterInterests.$loaded().then(function() {
			var saveInterests = debounce(function(i) {
				$scope.interests.$save(i)
			}, 1500);
			$scope.interests = voterInterests;
			// Updates the user's interest settings, i = interest number in array
			$scope.toggleInterest = function(i,j)
			{
				$scope.interests[i].data[j].support = !$scope.interests[i].data[j].support;
				saveInterests(i);
			}
		});

	});

}]);
