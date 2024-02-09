# ベースイメージの指定
FROM node:14

# 作業ディレクトリの設定
WORKDIR /app

# 依存関係ファイルをコピー
COPY package*.json ./

# 依存関係のインストール
RUN npm install

# アプリケーションのソースコードをコピー
COPY . /app/

# アプリケーションがリッスンするポートを指定
EXPOSE 3000

# アプリケーションを起動するコマンド
CMD ["node", "index.js"]

