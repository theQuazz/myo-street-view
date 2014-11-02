
function MyoMapExplorer(position, mapEl, searchEl) {
  var panoOptions = {
    position: position,
    addressControlOptions: {
      position: google.maps.ControlPosition.BOTTOM_CENTER
    },
    linksControl: false,
    panControl: false,
    zoomControl: false,
    enableCloseButton: false
  };
  
  this.panorama = new google.maps.StreetViewPanorama(mapEl , panoOptions);
  this.panorama.controls[google.maps.ControlPosition.TOP_CENTER].push(searchEl);

  this.searchBox = new google.maps.places.SearchBox(searchEl);
  google.maps.event.addListener(this.searchBox, 'places_changed', this.placeChanged.bind(this));
}

MyoMapExplorer.prototype.placeChanged = function() {
  var places = this.searchBox.getPlaces();
  if (!places.length) return;
  this.setLatLng(places[0].geometry.location, function(){});
}

MyoMapExplorer.prototype.setLatLng = function(latLng, cb) {
    var sv = new google.maps.StreetViewService();
    sv.getPanoramaByLocation(latLng, 1e2, function(data, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        this.panorama.setPosition(data.location.latLng);
        cb();
      } else {
        cb(new Error('Unable to find StreetView for that location'));
      }
    }.bind(this));
}

MyoMapExplorer.prototype.setMyoEmitter = function(emitter) {
  this.emitter = emitter;
  emitter.on('move_forward', this.moveForward.bind(this));
  emitter.on('move_backwards', this.moveBackward.bind(this));
  emitter.on('turn_left', this.rotateLeft.bind(this));
  emitter.on('turn_right', this.rotateRight.bind(this));
  emitter.on('wipe_down', this.lookDown.bind(this));
  emitter.on('wipe_up', this.lookUp.bind(this));
  emitter.on('left_rotate', this.zoomOut.bind(this));
  emitter.on('right_rotate', this.zoomIn.bind(this));
  //emitter.on('mark_page', this.turnRight.bind(this));
};
  
MyoMapExplorer.prototype.rotateLeft = function() {
  var pov = this.panorama.getPov();
  pov.heading -= 22.5;
  this.panorama.setPov(pov);
};

MyoMapExplorer.prototype.rotateRight = function() {
  var pov = this.panorama.getPov();
  pov.heading += 22.5;
  this.panorama.setPov(pov);
};

MyoMapExplorer.prototype.lookUp = function() {
  var pov = this.panorama.getPov();
  pov.pitch += 22.5;
  this.panorama.setPov(pov);
};

MyoMapExplorer.prototype.lookDown = function() {
  var pov = this.panorama.getPov();
  pov.pitch -= 22.5;
  this.panorama.setPov(pov);
};

MyoMapExplorer.prototype.moveForward = function() {
  var pov   = this.panorama.getPov();
  var links = this.panorama.getLinks();
  var best  = {diff: 0, link: null};

  for (var i in links) {
    var diff = (links[i].heading - pov.heading) % 360;
    if (diff < 0) diff += 360;
    if (diff > 180) diff = 360 - diff;
    if (diff < 45) {
      if (!best.link || diff < best.diff) {
        best = {diff: diff, link: links[i]};
      }
    }
  }

  if (best.link) this.panorama.setPano(best.link.pano);
};

MyoMapExplorer.prototype.moveBackward = function() {
  var pov   = this.panorama.getPov();
  var links = this.panorama.getLinks();
  var best  = {diff: 0, link: null};

  for (var i in links) {
    var diff = (links[i].heading - pov.heading) % 360;
    if (diff < 0) diff += 360;
    if (diff > 180) diff = 360 - diff;
    if (diff > 135) {
      if (!best.link || diff < best.diff) {
        best = {diff: diff, link: links[i]};
      }
    }
  }

  if (best.link) this.panorama.setPano(best.link.pano);
};

MyoMapExplorer.prototype.zoomIn = function() {
  this.panorama.setZoom(this.panorama.getZoom() + 1);
};

MyoMapExplorer.prototype.zoomOut = function() {
  this.panorama.setZoom(this.panorama.getZoom() - 1);
};

module.exports = MyoMapExplorer;
