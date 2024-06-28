// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('map')) {
    initMap();
  }
});

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });

  fetch('/posts.json')
    .then(response => response.json())
    .then(data => {
      data.forEach(post => {
        var marker = new google.maps.Marker({
          position: {lat: post.latitude, lng: post.longitude},
          map: map,
          title: post.title
        });

        var infowindow = new google.maps.InfoWindow({
          content: `<h3>${post.title}</h3><p>${post.description}</p><img src="${post.image_url}" alt="${post.title}" style="width:100px;height:100px;"/>`
        });

        marker.addListener('click', () => {
          infowindow.open(map, marker);
        });
      });
    });
}