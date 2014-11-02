// libraries
var myo          = require('myo');
var _            = require('lodash');
var EventEmitter = require('events').EventEmitter;

require('myo/experimental/myo.experimental');

var m = myo.create();
var initial = null;

var mapEvent = new EventEmitter();

function sendEvent(eventType) {
	if (!m.arm) return;
	console.log("recieved event: ", eventType);
	m.vibrate('short');
	mapEvent.emit(eventType);
}


var sendEventThrottled = _.throttle(sendEvent, 1200);

function detectRotation(data) {
	var x = data.x;
	var y = data.y;
	var z = data.z;
	if (!initial) initial = data;
	console.log(initial, data);
	m.on('fingers_spread', function(edge){
		if(edge) sendEventThrottled('move_backwards');
	})
	if ((initial.x-x) > 0.8) sendEventThrottled('wipe_down');
	else if(initial.x-x < -0.8) sendEventThrottled('wipe_up');
	else if ((initial.z-z > 0.065 ) && (initial.y-y < -0.065) && (initial.x-x>0.065)) sendEventThrottled('mark_down');
	else if ((initial.y - y) > 0.6) sendEventThrottled('left_rotate');
	else if ((initial.y - y) < -0.6) sendEventThrottled('right_rotate');
}

var createHandler = function(type) {
	return function(edge){
		m.timer(edge, 500, sendEventThrottled.bind(null, type));
	}
}

m.on('connected', function() {
	m.on('wave_in', createHandler('turn_left'));
	m.on('fist', createHandler('move_forward'));
	m.on('wave_out', createHandler('turn_right'));
	//m.on('pose', console.log);
	m.on('accelerometer', _.throttle(detectRotation, 400));
});

module.exports = mapEvent;
