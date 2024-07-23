// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
import "preview"


// ページが読み込まれたときに実行するイベントリスナーを追加
document.addEventListener('turbo:load', () => {
  // 現在のユーザーIDを取得
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

  // フォーム送信のイベントハンドラ
  function formSubmitHandler(event) {
    event.preventDefault(); // デフォルトのフォーム送信を防ぐ

    const formData = new FormData(form); // フォームデータを作成
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
        // 新しい投稿をallPostsに追加
        allPosts.push(data.post);
        addMarker(data.post); // 新しいマーカーを追加
        form.reset(); // フォームをリセット
        document.getElementById('form-container').style.display = 'none'; // フォームを非表示
        window.location.href = data.redirect_url; // 成功したらリダイレクト
      } else {
        alert('Error: ' + data.errors.join(', ')); // エラーメッセージを表示
      }
    })
    .catch(error => console.error('Error:', error)); // エラーハンドリング
  }

  form.removeEventListener('submit', formSubmitHandler); // 既存のイベントリスナーを削除
  form.addEventListener('submit', formSubmitHandler); // 新しいイベントリスナーを追加

  // 投稿表示切り替えボタンのクリックイベントリスナーを追加
  const togglePostsButton = document.getElementById('toggle-posts');

  // 初期状態を「自分の投稿のみ表示」に設定
  let showingAllPosts = false;

  togglePostsButton.addEventListener('click', function() {
    if (showingAllPosts) {
      filterMarkers(allPosts, 'user', currentUserId); // 自分の投稿を表示
    } else {
      filterMarkers(allPosts, 'all', currentUserId); // すべての投稿を表示
    }
    togglePostsButton.textContent = showingAllPosts ? 'みんなの投稿を表示' : '自分の投稿のみ表示'; // ボタンのテキストを切り替え
    showingAllPosts = !showingAllPosts; // 状態を反転
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

      // Googleマップを初期化し、スタイルを適用
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

      // ユーザーの現在位置にマーカーを表示
      new google.maps.Marker({
        position: userLocation,
        map: map,
        title: '今、ここにいるよ',
        icon: userLocationIcon
      });

      // 地図上をクリックしたときにマーカーを置き、地図をその位置にパン
      map.addListener('click', function(event) {
        placeMarkerAndPanTo(event.latLng, map);
        if (!isMarkerAtLocation(event.latLng)) {
          document.getElementById('custom-infowindow').style.display = 'none';
        }
      });

      // サーバーから投稿データを取得し、自分の投稿のみ表示
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

// 位置情報エラーのハンドリング
function handleLocationError(browserHasGeolocation, pos) {
  console.log(browserHasGeolocation ? "Error: The Geolocation service failed." : "Error: Your browser doesn't support geolocation.");
}

// マーカーを置き、地図をその位置にパンする関数
function placeMarkerAndPanTo(latLng, map) {
  if (currentMarker) {
    currentMarker.setMap(null);
  }

  currentMarker = new google.maps.Marker({
    position: latLng,
    map: map
  });
  map.panTo(latLng);

  // フォームの緯度経度フィールドに値を設定
  const latitudeField = document.getElementById('post_latitude');
  const longitudeField = document.getElementById('post_longitude');
  latitudeField.value = latLng.lat();
  longitudeField.value = latLng.lng();

  // フォームコンテナを表示
  const formContainer = document.getElementById('form-container');
  formContainer.style.display = 'block';
}

// 投稿データからマーカーを追加する関数
function addMarkers(posts) {
  clearMarkers(); // 既存のマーカーをクリア
  posts.forEach(post => {
    const image = new Image();
    image.onload = () => {
      let width = image.width;
      let height = image.height;
      const maxSize = 50; // 最大サイズを設定

      if (width > height) {
        const ratio = maxSize / width;
        width = maxSize;
        height = height * ratio;
      } else {
        const ratio = maxSize / height;
        height = maxSize;
        width = width * ratio;
      }

      // マーカーを作成し、地図に追加
      const marker = new google.maps.Marker({
        position: {lat: post.latitude, lng: post.longitude},
        map: map,
        title: post.title,
        icon: {
          url: post.image_url,
          scaledSize: new google.maps.Size(width, height)
        }
      });

      markers.push(marker);

      // マーカーをクリックしたときにカスタムインフォウィンドウを表示
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

// 既存のマーカーをクリアする関数
function clearMarkers() {
  markers.forEach(marker => marker.setMap(null));
  markers = [];
}

// カスタムインフォウィンドウを表示する関数
function displayCustomInfoWindow(post) {
  const image = new Image(); // 画像オブジェクトを作成

  image.onload = () => {
    let width = image.width;
    let height = image.height;
    const maxWidth = 300; // 表示する画像の最大幅
    const ratio = width / height;

    // 画像の幅が最大幅を超える場合、リサイズ
    if (width > maxWidth) {
      width = maxWidth;
      height = maxWidth / ratio;
    }

    // 投稿者の名前とそのリンクを追加
    const content = `
      <h3>${post.title}</h3>
      <p>${post.description}</p>
      <p><a href="${post.user_path}" target="_blank">投稿者：${post.user_name}</a></p>
      <img id="custom-image" src="${post.image_url}" alt="${post.title}" style="width:${width}px;height:${height}px;cursor:pointer;"/>
    `;

    document.getElementById('custom-infowindow-content').innerHTML = content;
    document.getElementById('custom-infowindow').style.display = 'block';

    // 画像クリックイベント
    document.getElementById('custom-image').onclick = () => {
      showModal(post.image_url);
    };
  };

  // 画像読み込みエラー時の処理
  image.onerror = () => {
    console.error('Error loading image: ', post.image_url);
  };

  // 画像のURLを設定
  image.src = post.image_url;
}

// 画像をモーダルで表示する関数
function showModal(imageUrl) {
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-image');
  const closeModal = document.getElementById('close-modal');

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

// 最新の投稿を表示する関数
function displayLatestPosts(posts) {
  const latestPostsGrid = document.getElementById('latest-posts-grid');
  latestPostsGrid.innerHTML = ''; // 現在の内容をクリア

  posts.forEach(post => {
    const cardWrapper = document.createElement('div');
    cardWrapper.className = 'card__wrapper';
    cardWrapper.onclick = () => moveToLocation(post.latitude, post.longitude); // カードをクリックすると地図が移動

    const card = document.createElement('div');
    card.className = 'card';

    if (post.image_url) { // 画像URLが存在する場合にチェック
      const img = document.createElement('img');
      img.className = 'card__img';
      img.src = post.image_url;
      img.onclick = (e) => {
        e.stopPropagation(); // クリックイベントの伝播を停止
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

    // 投稿者の名前とリンクを追加
    const author = document.createElement('p');
    author.className = 'card__author';
    const authorLink = document.createElement('a');
    authorLink.href = post.user_path;
    authorLink.textContent = post.user_name;
    authorLink.onclick = (e) => e.stopPropagation(); // クリックイベントの伝播を停止
    author.appendChild(authorLink);

    cardBody.appendChild(title);
    cardBody.appendChild(summary);
    cardBody.appendChild(author); // 投稿者の情報を追加
    card.appendChild(cardBody);
    cardWrapper.appendChild(card);
    latestPostsGrid.appendChild(cardWrapper);
  });
}

// 投稿の場所に地図を移動する関数
function moveToLocation(lat, lng) {
  const location = new google.maps.LatLng(lat, lng);
  map.panTo(location);
  map.setZoom(15); // 必要に応じてズームレベルを調整
}

// 指定した位置にマーカーがあるかどうかをチェックする関数
function isMarkerAtLocation(latLng) {
  return markers.some(marker => {
    return marker.getPosition() && marker.getPosition().equals(latLng);
  });
}

// 投稿データをフィルタリングしてマーカーを追加する関数
function filterMarkers(posts, filter, currentUserId) {
  let filteredPosts = posts;
  if (filter === 'user') {
    filteredPosts = posts.filter(post => post.user_id == currentUserId); // ユーザーの投稿をフィルタリング
  }
  addMarkers(filteredPosts);
}

// 新しい投稿をマップに追加する関数
function addMarker(post) {
  const image = new Image();
  image.onload = () => {
    let width = image.width;
    let height = image.height;
    const maxSize = 50; // 最大サイズを設定

    if (width > height) {
      const ratio = maxSize / width;
      width = maxSize;
      height = height * ratio;
    } else {
      const ratio = maxSize / height;
      height = maxSize;
      width = width * ratio;
    }

    // マーカーを作成し、地図に追加
    const marker = new google.maps.Marker({
      position: {lat: post.latitude, lng: post.longitude},
      map: map,
      title: post.title,
      icon: {
        url: post.image_url,
        scaledSize: new google.maps.Size(width, height)
      }
    });

    markers.push(marker);

    // マーカーをクリックしたときにカスタムインフォウィンドウを表示
    marker.addListener('click', () => {
      displayCustomInfoWindow(post);
    });
  };
  image.onerror = () => {
    console.error('Error loading image: ', post.image_url);
  };
  image.src = post.image_url;
}

const menuToggle = document.querySelector(".toggle");
const showcase = document.querySelector(".showcase");

menuToggle.addEventListener("click", function () {
  /* activeにする */
  menuToggle.classList.toggle("active");
  showcase.classList.toggle("active");
});