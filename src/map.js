function MyoMapExplorer(position) {
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
  
  this.panorama = new google.maps.StreetViewPanorama(el , panoOptions);
}
  
  var rotateLeft = function() {
    var pov = panorama.getPov();
    pov.heading -= 22.5;
    panorama.setPov(pov);
  };
  
  var rotateRight = function() {
    var pov = panorama.getPov();
    pov.heading += 22.5;
    panorama.setPov(pov);
  };
  
  var lookUp = function() {
    var pov = panorama.getPov();
    pov.pitch += 22.5;
    panorama.setPov(pov);
  };
  
  var lookDown = function() {
    var pov = panorama.getPov();
    pov.pitch -= 22.5;
    panorama.setPov(pov);
  };
  
  var moveForward = function() {
    var pov   = panorama.getPov();
    var links = panorama.getLinks();
    var best  = {diff: 0, link: null};

    for (var i in links) {
      var diff = Math.abs(links[i].heading - pov.heading);
      if (diff < 0) diff += 360;
      if (315 < diff || diff < 45) {
        if (!best.link || diff < best.diff) {
          best = {diff: diff, link: links[i]};
        }
      }
    }

    if (best.link) panorama.setPano(best.link.pano);
  };
  
  var moveBackward = function() {
    var pov   = panorama.getPov();
    var links = panorama.getLinks();
    var best  = {diff: 0, link: null};
    for (var l in links) {
      var diff = Math.abs(l.heading + 180 - pov.heading % 360);
      if (diff < 45) {
        if (!best || diff < best.diff) {
          best = {diff: diff, link: l};
        }
      }
    }
    if (best.link) panorama.setPano(best.link.pano);
  };
  
  var zoomIn = function() {
    panorama.setZoom(panorama.getZoom() + 1);
  };
  
  var zoomOut = function() {
    panorama.setZoom(panorama.getZoom() - 1);
  };
  
  window.pan = {
    rotateLeft: rotateLeft,
    rotateRight: rotateRight,
    lookUp: lookUp,
    lookDown: lookDown,
    moveForward: moveForward,
    moveBackward: moveBackward,
    zoomIn: zoomIn,
    zoomOut: zoomOut
  };
}

