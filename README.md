# アプリケーション名	
Open_world(仮)
# アプリケーション概要
地図上に写真を投稿することができ、他のユーザーの投稿を見ることもできる。
# URL	
https://open-world.onrender.com/
# テスト用アカウント
メールアドレス　test@gmail.com

パスワード　　　89828982
# 利用方法
・ログイン画面下の新規登録リンクをクリックしてサインアップを行う。

・地図が表示されるので、投稿したい地図の位置をクリックして
 タイトル（必須）・説明・写真を入力して投稿する

・メニューから写真の位置情報を使って投稿することもできる。

・マイページには自分の投稿が一覧で表示され、編集・削除ができる。

・地図に表示されている写真はクリックすることでウィンドウで説明が表示される。その写真をクリックすれば写真が元の大きさで表示される。

・地図左下の「みんなの写真も表示」をクリックすると、他のユーザーの写真も地図に表示される。

・「みんなの新規投稿」をクリックすると、他のユーザーの投稿が新しい順に表示される。

・「みんなの新規投稿」の写真部分をクリックすると写真を元の大きさで表示する。投稿の空白部分をクリックすると、その投稿がされている場所へ地図が移動する。ユーザー名をクリックするとそのユーザーのマイページへ移動する。

# アプリケーションを作成した背景
このアプリの着想は、最近のオープンワールド風ゲームから得ました。思い出や好きな場所などを地図上に可視化することで、ユーザーが「自分の居場所やまだよく知らない場所を認識できるようにしたかったからです。また、他のユーザーの投稿を参考にして、自分の地図を広げていけるようにすることを目指しました。

# 実装した機能についての画像やGIFおよびその説明※
・トップページ	
[![Image from Gyazo](https://i.gyazo.com/34c6a1f26b8bf4a6cb3ecaf940f2a6b6.jpg)](https://gyazo.com/34c6a1f26b8bf4a6cb3ecaf940f2a6b6)

・投稿機能
[![Image from Gyazo](https://i.gyazo.com/d2499e801796ec3a539c72bfc609be34.jpg)](https://gyazo.com/d2499e801796ec3a539c72bfc609be34)

・みんなの新規投稿表示機能
[![Image from Gyazo](https://i.gyazo.com/db335a5e38086bbedb32741fc4fa7da8.jpg)](https://gyazo.com/db335a5e38086bbedb32741fc4fa7da8)



# 実装予定の機能	
・ユーザーのフォロー機能、

　また、フォローしているユーザーのみ地図に表示する機能

・地図に表示した写真のピンに装飾

・いいね機能

・タグ付け機能

・コメント機能

・検索機能

・写真複数枚投稿機能

・投稿した写真の位置情報が被ってしまった時の対策を用意

・公開したくない写真は別データベースに保存できるように

# データベース設計
[![Image from Gyazo](https://i.gyazo.com/9bb2b89861e5f7b248f9e505a661976f.png)](https://gyazo.com/9bb2b89861e5f7b248f9e505a661976f)

# 画面遷移図
[![Image from Gyazo](https://i.gyazo.com/c4192dc5cb037c520a7f52050feaac30.png)](https://gyazo.com/c4192dc5cb037c520a7f52050feaac30)

# 開発環境
フロントエンドJavascript HTML CSS

バックエンド　Ruby Ruby on Rails

テスト　Rspec

テキストエディタ　VSCode

タスク管理 Github

# 工夫したポイント	
自分でも使いたくなる欲しくなるアプリを目指した。

そのためにはJavascriptを最大限使う必要があったので、独学で学んで実装した。

# 改善点
文字ではなく、記号や絵で直感的に使えるUI作成を行いたい。

コードの整理がうまくできておらず、リファクタリングをしにくい構造になってしまっている。そこまで考えられるようになりたい。

# 制作時間
２週間
