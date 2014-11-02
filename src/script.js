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
  console.log(eventType);
  m.vibrate('short');
  mapEvent.emit(eventType);
}


var sendEventThrottled = _.throttle(sendEvent, 1200);

function detectRotation(data) {
  var x = data.x;
  var y = data.y;
  var z = data.z;
  if (!initial) initial = data;
  if ((initial.x-x) > 0.6) sendEventThrottled('wipe_down');
  else if(initial.x-x < -0.65) sendEventThrottled('wipe_up');
  else if ((initial.y - y) > 0.7) sendEventThrottled('left_rotate');
  else if ((initial.y - y) < -0.3) sendEventThrottled('right_rotate');
}

var createHandler = function(type) {
  return function(edge){
    m.timer(edge, 300, sendEventThrottled.bind(null, type));
  }
}

m.on('connected', function() {
  m.on('wave_in', createHandler('turn_left'));
  m.on('fist', createHandler('move_forward'));
  m.on('wave_out', createHandler('turn_right'));
  m.on('fingers_spread', createHandler('move_backwards'));
  m.on('accelerometer', _.throttle(detectRotation, 500));
  //m.on('pose', console.log);
});

module.exports = mapEvent;
