angular.module('hack4CongressApp.services', ['firebase'])

.factory('hack4CongressFirebase', function($firebase) {
  return new Firebase("https://blistering-inferno-7388.firebaseio.com/");
})
.factory('Voter', function($firebase, hack4CongressFirebase) {
  var voterRoot = hack4CongressFirebase.child("Voters");
  return {
    all: function() {
      var fbVoters = $firebase(voterRoot);
      var votersObj = fbVoters.$asObject();
      return votersObj
    },
    get: function (vid) {
      fbVoter = voterRoot.child(vid);
      var voter = $firebase(fbVoter);
      var voterObj = voter.$asObject();
      voterObj.$loaded().then(function() {});
      return voterObj;
    },
    create: function (vid) {
      $firebase(voterRoot).$set(vid);
      return vid;
    },
  };
})
.factory('Interests', function($firebase, hack4CongressFirebase) {
  var interestsRoot = hack4CongressFirebase.child("Interests");
  return {
    save: function(vid, interests) {
      $firebase(interestsRoot).$set(vid, {"interests": interests});
      return vid
    },
    get: function(vid) {
      var interests = interestsRoot.child(vid);
      return $firebase(interests).$asObject();
    }
  }
});