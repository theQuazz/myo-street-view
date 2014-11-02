chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('build/proxy.html', {
    'bounds': {
      'width': 1000,
      'height': 1000
    }
  });
});
