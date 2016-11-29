var riggedHandPlugin;
var hand;
var index;
var confidence = "";
var circleProgress;
var completeCircles;
var e={};
var grab;
var count = 0;
// Leap Motion Settings
var last_frame;
var scene;
var action = null;
var last_action = null;
var start_action = 0;
var intent = false;
var delay_between_actions = 1;
var timeout = null;

// Track Leap Motion Connection
var now, last_poll = new Date().getTime() / 1000;
var connection;
var connection_lost_after = 5;

// Settings for Scroll Events
var width = window.innerWidth;
var height = window.innerHeight;
var scroll_speed = 20;
var scroll_smoothing = 4;

// Size for Finger Rendering in Pixels
var finger_size = 32;

// Colors for Fingers
var rainbow = new Array('#F80C12', '#FF3311', '#FF6644', '#FEAE2D', '#D0C310', '#69D025', '#12BDB9', '#4444DD', '#3B0CBD', '#442299');
var leap = '#9AC847';
var dark = '#000000';
var light = '#FFFFFF';

// Setup Default Settings for Leap Motion
var leap_motion_settings = {
  'fingers': 'yes',
  'color': 'rainbow',
  'scrolling': 'enabled',
  'history': 'enabled',
  'zoom': 'disabled',
  'rotation': 'disabled'
};

function click_page(pointables){
  var finger = pointables[0];
  var last_finger = last_frame.pointables[0];
  
  console.log(finger);
}

// Two Finger Page Scrolling
function scroll_page(pointables)
{
  var finger = pointables[0];
  var last_finger = last_frame.pointables[0];


  var horizontal_translation = 0;
  var horizontal_delta = finger.tipPosition.x - last_finger.tipPosition.x;

  var vertical_translation = 0;
  var vertical_delta = finger.tipPosition.y - last_finger.tipPosition.y;

  if (horizontal_delta > 10)
  {
    horizontal_translation = scroll_speed;
  }
  else if (horizontal_delta < 10)
  {
    horizontal_translation = -scroll_speed;
  }

  if (vertical_delta > scroll_smoothing)
  {
    vertical_translation = scroll_speed;
  }
  else if (vertical_delta < -scroll_smoothing)
  {
    vertical_translation = -scroll_speed;
  }

  window.scrollBy(horizontal_translation, vertical_translation);
}

// Look for Hand Gestures to Navigate History
function navigate_history(gesture)
{
  if (gesture.type === 'swipe' && gesture.state === 'stop')
  {
    if (gesture.direction.x > 0)
    {
      history.forward();
      console.log('Next Page');
    }
    else if (gesture.direction.x < 0)
    {
      history.back();
      console.log('Previous Page');
    }
  }
}

function Scroll(frame){
       var n=document.body;
       var r={};
       var i={};
            for(var s=0, o=frame.pointables.length; s!=o; s++){
                 var u=frame.pointables[s];
                 var a=e[u.id];
                 var f=n.scrollTop;
                 if(document.hasFocus()){
                 if(u.tipPosition[1]-325>0){n.scrollTop=f-=150}
                 if(u.tipPosition[1]-125>0){n.scrollTop=f-=5}
                 if(u.tipPosition[1]-90<0){n.scrollTop=f+=5}
             }
        }
}

function Zoom(frame){
    var hand = frame.hands[0];
    if(hand.pinchStrength.toPrecision(2) > 0.8){
      document.body.style.zoom="250%";
    }else if(hand.pinchStrength.toPrecision(2) < 0.8){
      document.body.style.zoom="100%";
    }
}

function dim(){
  if (count == 0){
    count +=1;
  }else if(count == 1){
    count = 0;
  }
}


var controllerOptions = {enableGestures: true};
var controller = Leap.loop(
controllerOptions,
{frame:function(frame){
Scroll(frame)
 if(frame.valid && frame.gestures.length > 0){  
  hand = frame.hands[0];
   var URLlink = "";
    var URLTarget = "";
    if (hand)
    {
      var screenPosition = hand.screenPosition(hand.palmPosition);
      // Use for testing only; 
      //var outputContent = "";
      //var outputgestureContent = "";
      var el = document.elementFromPoint(
        hand.screenPosition()[0],
        hand.screenPosition()[1]
      );

      if (el){
        // Use for testing only; 
        //outputContent += '<br>Topmost element: '+ el.tagName + ' #' + el.id +  ' .' + el.className + ' LINK: ' + el.href;
        //outputgestureContent = frame.gesture.type;
        if (!!el.href && el.href != "")
        {
          URLlink = el.href;
          if (el.target)
          {
            URLTarget = el.target;
          }else{
            URLTarget = "";
          }
        }
      }
      // Using for testing only; 
      // console.log(outputgestureContent + " " + URLlink + " " + URLTarget);
      // output.html(outputContent);
      // console.log(outputContent);
      // outputgesture.html(outputgestureContent);
      // var dot = Leap.vec3.dot(hand.direction, hand.indexFinger.direction);
      // console.assert(!isNaN(dot));
      // out.innerHTML = dot.toPrecision(2);
    }
  grab = hand.grabStrength.toPrecision(2);
   if(grab > 0.8){
     dim()
   }
  Zoom(frame)
  
  confidence = hand.confidence;
    frame.gestures.forEach(function(gesture){
      circleProgress = gesture.progress;
      completeCircles = Math.floor(circleProgress);
      if(confidence > .6 && gesture.state === 'stop'){
        switch (gesture.type){
          case "circle":
            if(completeCircles >= 5){
                window.location = location.href + '?upd=' + 123456;
                console.log("Reload");
              }
              break;
          case "screenTap":
              outputgestureContent = "";
              //location.href = URLlink;
              if (URLTarget != "")
              {
                window.open(URLlink,   URLTarget);
              }else{
                window.open(URLlink, "_self");
              }
              console.log("Screen Tap Gesture");
              break;
          case "swipe":
              navigate_history(frame.gestures[0]);
              console.log("Swipe Gesture");
              break;
        }
      }
    });
  }
}}).use('screenPosition', {
  scale: 0.70
});


  controller.use('riggedHand', {
    parent: window.scene,
    camera: window.camera,
    scale: 0.75,
    positionScale: 5,
    offset: new THREE.Vector3(0, -5, 0),
    renderFn: function() {},
    boneColors: function(boneMesh, leapHand) {
      
      if ((boneMesh.name.indexOf('Finger_') == 0) ) {
         return {
          hue: 0.564,
          saturation: leapHand.grabStrength,
          lightness: 0.5
         }
      }else{
       return {
        hue: 0.6,
        saturation: 0.2,
        lightness: 0.8,
      };
      }
    }
  });
  controller.connect();


//--Speech and sythesis

function say(text){
  var msg = new SpeechSynthesisUtterance();
  var voices = window.speechSynthesis.getVoices();
  msg.voice = voices[10];
  msg.voiceURI = 'native';
  msg.volume = 1; // 0 to 1
  msg.rate = 0.8; // 0.1 to 10
  msg.pitch = 0; //0 to 2
  msg.text = text;
  msg.lang = 'en-US';
  speechSynthesis.speak(msg);
}


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