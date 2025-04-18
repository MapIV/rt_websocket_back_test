# Python 3.10 をベースに使用
FROM python:3.10

# 作業ディレクトリを /app に設定
WORKDIR /app

# システムパッケージのインストール（ビルドツール、OpenCV関連ライブラリ）
RUN apt-get update && apt-get install -y \
    build-essential \
    python3-dev \
    libssl-dev \
    libffi-dev \
    libopencv-dev

# 依存関係のインストール
COPY requirements.txt .

# pip と setuptools を最新に更新
RUN pip install --upgrade pip setuptools

# 依存関係をインストール（キャッシュを使わない）
RUN pip install --no-cache-dir -r requirements.txt

# OpenCVのインストール
RUN pip install opencv-python

# ソースコード（tests ディレクトリのみ）をコンテナにコピー
COPY test/ test/

# サーバーの起動コマンド
CMD ["python", "test/test_main.py"]
