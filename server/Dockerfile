# Node.jsのバージョンを指定する
FROM node:14

# アプリケーションの作業ディレクトリを設定
WORKDIR /usr/src/app

# アプリケーションの依存関係ファイルをコピー
COPY package*.json ./

# npmパッケージをインストール
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# アプリケーションがリッスンするポートを指定
EXPOSE 3000

# アプリケーションを起動するコマンド
CMD ["node", "index.js"]
