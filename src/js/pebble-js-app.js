Pebble.addEventListener("ready", function(e) {
    console.log("Ready");
})

Pebble.addEventListener('showConfiguration', function(e) {
    console.log("config");
  	Pebble.getTimelineToken(
	  function (token) {
  		  var URL = 'http://feedthetimeline.appspot.com/config?token=' + token;
		  console.log('Configuration window opened. ' + URL);
		  Pebble.openURL(URL);
	  },
	  function (error) { 
    	console.log('Error getting timeline token: ' + error);
	  }
	);

});

Pebble.addEventListener("webviewclosed", function(e) {
    console.log("configuration closed");
    if (e.response != '') {
		var configuration = JSON.parse(decodeURIComponent(e.response));
		console.log('subscriptions' + configuration.subscriptions);
		var subscriptions = configuration.subscriptions;
		
		// First get our current subscriptions
		Pebble.timelineSubscriptions(
	    	function (topics) {
	    	
	    		// First go through current topics and see if we need to remove any
	    		for (var t = 0; t < topics.length; t++) {
	    			var topic = topics[t];
	    			// If our topic isn't found then unsubscribe from topic
	    			if (subscriptions.indexOf(topic) == -1) {
	 		    		Pebble.timelineUnsubscribe(topic,
				    		function () { 
  								console.log('Unsubscribed from ' + topic);
							}, 
				    		function (errorString) { 
					    		console.log('Error unsubscribing from topic: ' + topic + ' Error:' + errorString);
			  				}
						);
					}
				}
				
				for (var s = 0; s < subscriptions.length; s++) {
					var subscription = subscriptions[s];
	    			// If our subscription isn't found then subscribe to him
	    			if (topics.indexOf(subscription) == -1) {
              
	 		    		Pebble.timelineSubscribe(subscription,
				    		function () { 
  								console.log('Subscribed from ' + subscription);
							}, 
				    		function (errorString) { 
			                  console.log('Error subscribing for topic: ' + subscription + ' Error:'+ errorString);
			  				}
						);
	    			}
				}
		    }, 
  			function (errorString) { 
			    console.log('Error retrieving Subscriptions? '+ errorString);
		  }
		);
    } else {
		console.log("no options received");
    }
});