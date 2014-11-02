document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('main').addEventListener('permissionrequest', function(e) {
    if (e.permission == 'geolocation') e.request.allow();
  });
});
