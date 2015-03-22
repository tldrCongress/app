angular.module('hack4CongressApp.services', ['firebase'])

.factory('hack4CongressFirebase', function($firebase) {
  return new Firebase("https://blistering-inferno-7388.firebaseio.com/");
})
.factory('AllData', function($firebase, hack4CongressFirebase) {

  // create an AngularFire reference to the data
  var sync = $firebase(hack4CongressFirebase);

  // download the data into a local object
  var syncObject = sync.$asObject();

  return syncObject;
})
.factory('Voter', function($firebase, hack4CongressFirebase) {
  var voterRoot = hack4CongressFirebase.child("voters");
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
    create: function (vid, email, zip) {
      $firebase(voterRoot).$set(vid, {"email": email});
      $firebase(voterRoot).$update(vid, {"zip": email});
      return vid;
    },
  };
})
.factory('VoterInterests', function($firebase, hack4CongressFirebase) {
  var voterInterestsRoot = hack4CongressFirebase.child("voterInterests");
  return {
    save: function(vid, interests) {
      $firebase(voterInterestsRoot).$set(vid, {"interests": interests});
      return vid
    },
    get: function(vid) {
      var interests = voterInterestsRoot.child(vid);
      return $firebase(interests).$asObject();
    }
  }
})
.factory('Interests', function($firebase, hack4CongressFirebase) {
  var interestsRoot = hack4CongressFirebase.child("interests");
  return {
    get: function() {
      var interests = $firebase(interestsRoot);
      var interestsObj = interests.$asObject();
      return interestsObj;
    }
  }
})
;