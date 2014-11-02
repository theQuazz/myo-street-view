// libraries
var myo          = require('myo');
var _            = require('lodash');
var EventEmitter = require('events').EventEmitter;

require('myo/experimental/myo.experimental');

var m = myo.create();

var mapEvent = new EventEmitter();

function sendEvent(eventType) {
	if (!m.arm) return;
	console.log("recieved event: ", eventType);
	m.vibrate('short');
	mapEvent.emit(eventType);
}


var sendEventThrottled = _.throttle(sendEvent, 1000);
myo.options.doubleTap.threshold = 1;
myo.options.doubleTap.time = 300;

function detectRotation(data) {
	var x = data.x;
	var y = data.y;
	var z = data.z;
//	console.log(x,y,z);
	if (x < -0.8) sendEventThrottled('wipe_down');
	else if (x > 0.8 ) sendEventThrottled('wipe_up');
	else if (y < 0) sendEventThrottled('left_rotate');
	else if (y > 0.9) sendEventThrottled('right_rotate');
}

var createHandler = function(type) {
	return function(edge){
		m.timer(edge, 500, sendEventThrottled.bind(null, type));
	}
}

m.on('connected', function() {
	m.on('fingers_spread', createHandler('move_backwards'));
	//m.on('thumb_to_pinky', createHandler('mark_location'));
	m.on('fist', createHandler('move_forward'));
	m.on('wave_in', createHandler('turn_left'));
	m.on('wave_out', createHandler('turn_right'));
	m.on('double_tap',createHandler('mark_page'));
	//m.on('pose', console.log);
	m.on('accelerometer', _.throttle(detectRotation, 400));
});

console.log('up and running');
