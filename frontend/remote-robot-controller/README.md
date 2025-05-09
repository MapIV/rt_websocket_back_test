# React アプリのセットアップと実行

## 1️⃣ Yarn のインストール
まず、`yarn` をインストールします。

### 🔹 Yarn がすでにインストールされているか確認
`yarn -v`

## されていなかった場合

### 1️⃣ nvm をインストール
`curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash`
`source ~/.bashrc  # 設定を適用`

### 2️⃣ 最新の LTS バージョンをインストール（推奨）
`nvm install --lts`

### 3️⃣ Node.js のバージョン確認
`node -v`

### 2️⃣ Yarn を npm でインストール
`npm install -g yarn`

### 3️⃣ インストール確認
`yarn -v`

## プロジェクトのルートディレクトリ（package.json がある場所）で以下を実行
`yarn install`

## 以下のコマンドで開発サーバーを起動
`yarn run start`
