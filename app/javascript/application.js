// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('map')) {
    initMap();
  }
});

let currentMarker;

function initMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      var map = new google.maps.Map(document.getElementById('map'), {
        center: userLocation,
        zoom: 15
      });

      new google.maps.Marker({
        position: userLocation,
        map: map,
        title: 'You are here'
      });

      map.addListener('click', function(event) {
        placeMarkerAndPanTo(event.latLng, map);
      });

      fetch('/posts.json')
        .then(response => response.json())
        .then(data => {
          data.forEach(post => {
            var marker = new google.maps.Marker({
              position: {lat: post.latitude, lng: post.longitude},
              map: map,
              title: post.title,
              icon: {
                url: post.image_url,
                scaledSize: new google.maps.Size(50, 50), // 画像のサイズを適宜調整
              }
            });

            var infowindow = new google.maps.InfoWindow({
              content: `<h3>${post.title}</h3><p>${post.description}</p><img src="${post.image_url}" alt="${post.title}" style="width:100px;height:100px;"/>`
            });

            marker.addListener('click', () => {
              infowindow.open(map, marker);
            });
          });
        });
    }, () => {
      handleLocationError(true, map.getCenter());
    });
  } else {
    // ブラウザがGeolocationをサポートしていない場合
    handleLocationError(false, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, pos) {
  console.log(browserHasGeolocation ? "Error: The Geolocation service failed." : "Error: Your browser doesn't support geolocation.");
}

function placeMarkerAndPanTo(latLng, map) {
  if (currentMarker) {
    currentMarker.setMap(null);
  }

  currentMarker = new google.maps.Marker({
    position: latLng,
    map: map
  });
  map.panTo(latLng);

  var latitudeField = document.getElementById('post_latitude');
  var longitudeField = document.getElementById('post_longitude');
  latitudeField.value = latLng.lat();
  longitudeField.value = latLng.lng();

  var formContainer = document.getElementById('form-container');
  formContainer.style.display = 'block';
}