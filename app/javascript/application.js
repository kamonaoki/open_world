// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('map')) {
    initMap();
  }
});

let currentMarker;
let map;
let markers = [];

function initMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      map = new google.maps.Map(document.getElementById('map'), {
        center: userLocation,
        zoom: 15
      });

      new google.maps.Marker({
        position: userLocation,
        map: map,
        title: 'You are here'
      });

      map.addListener('click', function(event) {
        if (!isMarkerAtLocation(event.latLng)) {
          document.getElementById('custom-infowindow').style.display = 'none';
        }
      });

      fetch('/posts.json')
        .then(response => response.json())
        .then(data => {
          data.forEach(post => {
            addMarker(post);
          });
        });
    }, () => {
      handleLocationError(true, map.getCenter());
    });
  } else {
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

function addMarker(post) {
  var image = new Image();
  image.onload = () => {
    var width = image.width;
    var height = image.height;
    var maxSize = 50; // 最大サイズを設定

    if (width > height) {
      var ratio = maxSize / width;
      width = maxSize;
      height = height * ratio;
    } else {
      var ratio = maxSize / height;
      height = maxSize;
      width = width * ratio;
    }

    var marker = new google.maps.Marker({
      position: {lat: post.latitude, lng: post.longitude},
      map: map,
      title: post.title,
      icon: {
        url: post.image_url,
        scaledSize: new google.maps.Size(width, height)
      }
    });

    markers.push(marker);

    marker.addListener('click', () => {
      displayCustomInfoWindow(post);
    });
  };
  image.onerror = () => {
    console.error('Error loading image: ', post.image_url);
  };
  image.src = post.image_url;
}

function displayCustomInfoWindow(post) {
  var image = new Image();
  image.onload = () => {
    var width = image.width;
    var height = image.height;
    var maxWidth = 300; // 表示する画像の最大幅
    var ratio = width / height;

    if (width > maxWidth) {
      width = maxWidth;
      height = maxWidth / ratio;
    }

    var content = `<h3>${post.title}</h3><p>${post.description}</p><img id="custom-image" src="${post.image_url}" alt="${post.title}" style="width:${width}px;height:${height}px;cursor:pointer;"/>`;

    document.getElementById('custom-infowindow-content').innerHTML = content;
    document.getElementById('custom-infowindow').style.display = 'block';

    // 画像クリックイベント
    document.getElementById('custom-image').onclick = () => {
      showModal(post.image_url);
    };
  };
  image.onerror = () => {
    console.error('Error loading image: ', post.image_url);
  };
  image.src = post.image_url;
}

function showModal(imageUrl) {
  var modal = document.getElementById('image-modal');
  var modalImg = document.getElementById('modal-image');
  var closeModal = document.getElementById('close-modal');

  modal.style.display = "block";
  modalImg.src = imageUrl;

  closeModal.onclick = () => {
    modal.style.display = "none";
  };

  // モーダルウィンドウ外をクリックしたときに閉じる
  modal.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}

function isMarkerAtLocation(latLng) {
  return markers.some(marker => {
    return marker.getPosition().equals(latLng);
  });
}

document.querySelector('form').addEventListener('submit', function(event) {
  event.preventDefault();

  var formData = new FormData(this);
  fetch(this.action, {
    method: 'POST',
    body: formData,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      addMarker(data.post);
      this.reset();
      document.getElementById('form-container').style.display = 'none';
      window.location.href = data.redirect_url; // 成功したらリダイレクト
    } else {
      // エラーハンドリング
      alert('Error: ' + data.errors.join(', '));
    }
  })
  .catch(error => console.error('Error:', error));
});

