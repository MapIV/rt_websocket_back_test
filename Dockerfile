# Python 3.10 をベースに使用
FROM python:3.10

# 作業ディレクトリを /app に設定
WORKDIR /app

# 依存関係のインストール
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

RUN apt -y update
RUN apt -y install libopencv-dev

# ソースコード（tests ディレクトリのみ）をコンテナにコピー
COPY test/ test/

# サーバーの起動コマンド
CMD ["python", "test/test_main.py"]
