// Voter service

'use strict';

app.factory('Voter', ['$firebaseObject', 'dataShare',
    function($firebaseObject, dataShare) {
        if (dataShare.voterId == undefined) {
            var voterId = Math.round(Math.random() * 100000000);
        } else {
            var voterId = dataShare.voterId;
        }
        var url = 'https://blistering-inferno-7388.firebaseio.com/voters/' + voterId;
        var ref = new Firebase(url);
        return $firebaseObject(ref);
    }
])