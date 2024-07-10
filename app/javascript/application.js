// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
import "preview"

document.addEventListener('turbo:load', () => {
  const currentUserId = document.body.dataset.userId;

  // マップの要素が存在する場合に地図を初期化
  if (document.getElementById('map')) {
    initMap(currentUserId);
  }

  // フォームの閉じるボタンのイベントリスナーを追加
  document.querySelector('.close-form').addEventListener('click', function() {
    document.getElementById('form-container').style.display = 'none';
  });

  // カスタムインフォウィンドウの閉じるボタンのイベントリスナーを追加
  document.querySelector('.close-custom-window').addEventListener('click', function() {
    document.getElementById('custom-infowindow').style.display = 'none';
  });

  // フォームの送信イベントリスナーを追加
  const form = document.querySelector('form');

  function formSubmitHandler(event) {
    event.preventDefault(); // デフォルトのフォーム送信を防ぐ

    var formData = new FormData(form); // フォームデータを作成
    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    .then(response => response.json()) // レスポンスをJSONとしてパース
    .then(data => {
      if (data.status === 'success') {
        addMarker(data.post); // 新しいマーカーを追加
        form.reset(); // フォームをリセット
        document.getElementById('form-container').style.display = 'none'; // フォームを非表示
        window.location.href = data.redirect_url; // 成功したらリダイレクト
      } else {
        alert('Error: ' + data.errors.join(', '));
      }
    })
    .catch(error => console.error('Error:', error)); // エラーハンドリング
  }

  form.removeEventListener('submit', formSubmitHandler); // 既存のイベントリスナーを削除
  form.addEventListener('submit', formSubmitHandler); // 新しいイベントリスナーを追加

  const togglePostsButton = document.getElementById('toggle-posts');

  let showingAllPosts = false; // 初期状態を「自分の投稿のみ表示」にする

  togglePostsButton.addEventListener('click', function() {
    if (showingAllPosts) {
      filterMarkers(allPosts, 'user', currentUserId);
    } else {
      filterMarkers(allPosts, 'all', currentUserId);
    }
    togglePostsButton.textContent = showingAllPosts ? 'みんなの投稿を表示' : '自分の投稿のみ表示';
    showingAllPosts = !showingAllPosts;
  });

  // 最新の投稿を表示するボタンのクリックイベントリスナーを追加
  const latestPostsButton = document.getElementById('show-latest-posts');
  const latestPostsSection = document.getElementById('latest-posts-section');

  latestPostsButton.addEventListener('click', function() {
    if (latestPostsSection.style.display === 'none' || !latestPostsSection.style.display) {
      fetch('/latest_posts')
        .then(response => response.json())
        .then(data => {
          displayLatestPosts(data);
          latestPostsSection.style.display = 'block'; // 表示
        })
        .catch(error => console.error('Error:', error));
    } else {
      latestPostsSection.style.display = 'none'; // 非表示
    }
  });
});

// 地図の初期化関連コード
let currentMarker;
let map;
let markers = [];
let allPosts = [];

// 地図を初期化する関数
function initMap(currentUserId) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // 地図のスタイルを設定
      const mapStyle = [
        {
          "elementType": "geometry",
          "stylers": [
            { "color": "#e7f0c3" }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            { "color": "#6b8e23" }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            { "color": "#ffffff" }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [
            { "color": "#c0c0c0" }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "geometry.stroke",
          "stylers": [
            { "color": "#dcd2be" }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [
            { "color": "#ae9e90" }
          ]
        },
        {
          "featureType": "landscape.natural",
          "elementType": "geometry",
          "stylers": [
            { "color": "#b7e6a7" }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            { "color": "#b7e6a7" }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            { "color": "#6b8e23" }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry.fill",
          "stylers": [
            { "color": "#76c769" }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            { "color": "#3a5f0b" }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            { "color": "#ffffff" }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
            { "color": "#fefefe" }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            { "color": "#f8c967" }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            { "color": "#e9bc62" }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry",
          "stylers": [
            { "color": "#e98d58" }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry.stroke",
          "stylers": [
            { "color": "#db8555" }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            { "color": "#806b63" }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [
            { "color": "#b7e6a7" }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.fill",
          "stylers": [
            { "color": "#8f7d77" }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.stroke",
          "stylers": [
            { "color": "#e7f0c3" }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [
            { "color": "#b7e6a7" }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [
            { "color": "#a1cdfc" }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            { "color": "#92998d" }
          ]
        }
      ];

      map = new google.maps.Map(document.getElementById('map'), {
        center: userLocation,
        zoom: 15,
        styles: mapStyle
      });

      const userLocationIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#00F',
        fillOpacity: 0.8,
        strokeWeight: 1,
        strokeColor: '#FFF'
      };

      new google.maps.Marker({
        position: userLocation,
        map: map,
        title: '今、ここにいるよ',
        icon: userLocationIcon
      });

      map.addListener('click', function(event) {
        placeMarkerAndPanTo(event.latLng, map);
        if (!isMarkerAtLocation(event.latLng)) {
          document.getElementById('custom-infowindow').style.display = 'none';
        }
      });

      fetch('/posts.json')
        .then(response => response.json())
        .then(data => {
          allPosts = data;
          filterMarkers(data, 'user', currentUserId); // 自分の投稿のみ表示
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

function addMarkers(posts) {
  clearMarkers(); // 既存のマーカーをクリア
  posts.forEach(post => {
    var image = new Image();
    image.onload = () => {
      var width = image.width;
      var height = image.height;
      var maxSize = 50;

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
  });
}

function clearMarkers() {
  markers.forEach(marker => marker.setMap(null));
  markers = [];
}

function displayCustomInfoWindow(post) {
  const image = new Image(); 

  image.onload = () => {
    let width = image.width;
    let height = image.height;
    const maxWidth = 300;
    const ratio = width / height;

    if (width > maxWidth) {
      width = maxWidth;
      height = maxWidth / ratio;
    }

    const content = `
      <h3>${post.title}</h3>
      <p>${post.description}</p>
      <p><a href="${post.user_path}" target="_blank">投稿者：${post.user_name}</a></p>
      <img id="custom-image" src="${post.image_url}" alt="${post.title}" style="width:${width}px;height:${height}px;cursor:pointer;"/>
    `;

    document.getElementById('custom-infowindow-content').innerHTML = content;
    document.getElementById('custom-infowindow').style.display = 'block';

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

  modal.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}

function displayLatestPosts(posts) {
  const latestPostsGrid = document.getElementById('latest-posts-grid');
  latestPostsGrid.innerHTML = '';

  posts.forEach(post => {
    const cardWrapper = document.createElement('div');
    cardWrapper.className = 'card__wrapper';
    cardWrapper.onclick = () => moveToLocation(post.latitude, post.longitude);

    const card = document.createElement('div');
    card.className = 'card';

    if (post.image_url) {
      const img = document.createElement('img');
      img.className = 'card__img';
      img.src = post.image_url;
      img.onclick = (e) => {
        e.stopPropagation();
        showModal(post.image_url);
      };
      card.appendChild(img);
    }

    const cardBody = document.createElement('div');
    cardBody.className = 'card__body';

    const title = document.createElement('h2');
    title.className = 'card__title';
    title.textContent = post.title;

    const summary = document.createElement('p');
    summary.className = 'card__summary';
    summary.textContent = post.description;

    const author = document.createElement('p');
    author.className = 'card__author';
    const authorLink = document.createElement('a');
    authorLink.href = post.user_path;
    authorLink.textContent = post.user_name;
    authorLink.onclick = (e) => e.stopPropagation();
    author.appendChild(authorLink);

    cardBody.appendChild(title);
    cardBody.appendChild(summary);
    cardBody.appendChild(author);
    card.appendChild(cardBody);
    cardWrapper.appendChild(card);
    latestPostsGrid.appendChild(cardWrapper);
  });
}

function moveToLocation(lat, lng) {
  const location = new google.maps.LatLng(lat, lng);
  map.panTo(location);
  map.setZoom(15);
}

function isMarkerAtLocation(latLng) {
  return markers.some(marker => {
    return marker.getPosition() && marker.getPosition().equals(latLng);
  });
}

function filterMarkers(posts, filter, currentUserId) {
  let filteredPosts = posts;
  if (filter === 'user') {
    filteredPosts = posts.filter(post => post.user_id == currentUserId);
  }
  addMarkers(filteredPosts);
}
