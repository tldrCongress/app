'use strict';

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
});

app.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    var ref = new Firebase("https://blistering-inferno-7388.firebaseio.com");
    return $firebaseAuth(ref);
  }
]);

//
app.factory('StafferComments', ['$firebaseObject',
  function($firebaseObject) {
    var url = 'https://blistering-inferno-7388.firebaseio.com/StafferComments/';
    var ref = new Firebase(url);
    return $firebaseObject(ref);
  }
]);

//
app.factory('StafferCommentsUpcoming', ['$firebaseObject',
  function($firebaseObject) {
    var url = 'https://blistering-inferno-7388.firebaseio.com/StafferCommentsUpcoming/';
    var ref = new Firebase(url);
    return $firebaseObject(ref);
  }
]);

//
app.factory('ContentCreators', ['$firebaseObject',
  function($firebaseObject) {
    var url = 'https://blistering-inferno-7388.firebaseio.com/ContentCreators/';
    var ref = new Firebase(url);
    return $firebaseObject(ref);
  }
]);

//
app.factory('Interests', ['$firebaseArray', 'dataShare',
  function($firebaseArray, dataShare) {
    var voterId = dataShare.get().voterId;
    var urlInterests = 'https://blistering-inferno-7388.firebaseio.com/interests';
    var refInterests = new Firebase(urlInterests);
    var genericInterests = $firebaseArray(refInterests);
      
    return genericInterests;
  }
]);


//
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
]);