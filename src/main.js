
var MyoMapExplorer = require('./map');
var emitter        = require('./script');

var radius = 1e6;

window.initialize = function() {
  function getLocation() {
    console.log(navigator.geolocation);
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log('?');
      var sv = new google.maps.StreetViewService();
      sv.getPanoramaByLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }, radius, function(data, status) {
        if (status == google.maps.StreetViewStatus.OK) {
          var mapEl = document.getElementById('street-view');
          var searchEl = document.getElementById('search');
          myoMapExplorer = new MyoMapExplorer(data.location.latLng, mapEl, searchEl);
          myoMapExplorer.setMyoEmitter(emitter);
          console.log('up and running');
        }
      });
    });
  }

  google.maps.event.addDomListener(window, 'load', getLocation);
}
