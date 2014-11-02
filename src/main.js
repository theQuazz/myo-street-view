
var el = document.getElementById('street-view');

function getLocation() {
  navigator.geolocation.getCurrentPosition(function(position) {
    var sv = new google.maps.StreetViewService();
    sv.getPanoramaByLocation({
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }, 49, function(data, status) {
      if (status == google.maps.StreetViewStatus.OK)
        window.myoMapExplorer = new MyoMapExplorer(data.location.latLng);
    });
  });
}

google.maps.event.addDomListener(window, 'load', getLocation);
