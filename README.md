# tango_cho

オリジナルの単語帳アプリを作ってみた。
サーバー側を自分なりにフレームワークを使わずに実装してみた。
APIやWebサービスの動きがなんとなくイメージできてきた。いい勉強になった。

# 環境
macOS High Sierra 10.13.3
Node.js v10.5.0
npm 6.1.0
mysql 8.0.11

# 使い方

- src直下に、dbInfo.jsonを作成。MySQLに接続するための情報として、host, user, password, database, tableをsれぞれ記入。
- tango_choディレクトリで、「$ node src/server」実行。サーバーが立ち上がる。
- ブラウザで「http://<<host>>:4000」にアクセス。
