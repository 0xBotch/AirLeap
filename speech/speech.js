	// Define a new speech recognition instance
	var rec = null;
	var recognizing = false;
	try {
		rec = new webkitSpeechRecognition();
	} 
	catch(e) {
    	document.querySelector('.msg').setAttribute('data-state', 'show');
    	startRecBtn.setAttribute('disabled', 'true');
    	startRecBtn.setAttribute('disabled', 'true');
    }
    if (rec) {
		rec.continuous = true;
		rec.interimResults = false;
		rec.lang = 'en';

		// Define a threshold above which we are confident(!) that the recognition results are worth looking at 
		var confidenceThreshold = 0.5;

		// Simple function that checks existence of s in str
		var userSaid = function(str, s) {
			return str.indexOf(s) > -1;
		}

          rec.onstart = function() {
            recognizing = true;
          };

		// Process the results when they are returned from the recogniser
		rec.onresult = function(e) {
			// Check each result starting from the last one
			for (var i = e.resultIndex; i < e.results.length; ++i) {
				// If this is a final result
	       		if (e.results[i].isFinal) {
	       			// If the result is equal to or greater than the required threshold
	       			if (parseFloat(e.results[i][0].confidence) >= parseFloat(confidenceThreshold)) {
		       			var str = e.results[i][0].transcript;
		       			console.log('Recognised: ' + str);
		       			// If the user said 'video' then parse it further
		       			if (userSaid(str, 'home')) {
							console.log('home');
		       			}else if(userSaid(str, 'values')) {
                            console.log('values');
                        }else if(userSaid(str, 'test')) {
                            console.log('test');
                        }else if(userSaid(str, 'control')) {
                            console.log('control');
                        }else if(userSaid(str, 'info')) {
                            console.log('info');
                        }
	       			}
	        	}
	    	}
		};

		// Start speech recognition
		var startRec = function() {
              if (recognizing) {
                stopRec()
                return;
              }
			rec.start();
			recStatus.innerHTML = 'recognising';
		}
		// Stop speech recognition
		var stopRec = function() {
			rec.stop();
			recStatus.innerHTML = 'not recognising';
		}
		// Setup listeners for the start and stop recognition buttons
		startRecBtn.addEventListener('click', startRec, false);
	}