document.addEventListener('turbo:load', function(){
  // 新規投稿・編集ページのフォームを取得
  const postForm = document.getElementById('avatar_form');

  // プレビューを表示するためのスペースを取得
  const previewList = document.getElementById('avatar_previews');

  // 新規投稿・編集ページのフォームがないならここで終了
  if (!postForm) return null;
  console.log("avatar_preview.jsが読み込まれました");

  // input要素を取得
  const fileField = document.querySelector('input[type="file"][name="user[avatar]"]');

  // input要素で値の変化が起きた際に呼び出される関数
  fileField.addEventListener('change', function(e){
    // 古いプレビューが存在する場合は削除
    const alreadyPreview = document.querySelector('.preview');
    if (alreadyPreview) {
      alreadyPreview.remove();
    }
    console.log("input要素で値の変化が起きました");

    // 選択されたファイルを取得
    const file = e.target.files[0];
    const reader = new FileReader();

    // ファイルが読み込まれた時の処理
    reader.onload = function(event) {
      const img = new Image();
      img.src = event.target.result;

      // 画像が読み込まれた時の処理
      img.onload = function() {
        // キャンバス要素を作成
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxWidth = 200;  // 最大幅
        const maxHeight = 200; // 最大高さ
        let width = img.width;
        let height = img.height;

        // 画像の比率を保ちながらリサイズ
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        // キャンバスのサイズを設定
        canvas.width = width;
        canvas.height = height;
        // 画像をキャンバスに描画
        ctx.drawImage(img, 0, 0, width, height);

        // プレビューを表示するためのdiv要素を生成
        const previewWrapper = document.createElement('div');
        previewWrapper.setAttribute('class', 'preview');

        // 表示する画像要素を生成
        const previewImage = document.createElement('img');
        previewImage.setAttribute('class', 'preview-image');
        previewImage.src = canvas.toDataURL(file.type); // キャンバスからデータURLを取得

        // プレビュー要素を組み立てて表示
        previewWrapper.appendChild(previewImage);
        previewList.appendChild(previewWrapper);
      }
    }
    // ファイルをデータURLとして読み込む
    reader.readAsDataURL(file);
  });
});