var MyoMapExplorer = require('./map');
var emitter        = require('./script');

function getLocation() {
  navigator.geolocation.getCurrentPosition(function(position) {
    var sv = new google.maps.StreetViewService();
    sv.getPanoramaByLocation({
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }, 49, function(data, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var el = document.getElementById('street-view');
        window.myoMapExplorer = new MyoMapExplorer(data.location.latLng, el);
        window.myoMapExplorer.setMyoEmitter(emitter);
        console.log('up and running');
      }
    });
  });
}

google.maps.event.addDomListener(window, 'load', getLocation);
