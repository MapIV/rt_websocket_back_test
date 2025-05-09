ARG USERNAME=user
ARG USER_UID=1000
ARG USER_GID=$USER_UID
# Python 3.10 をベースに使用

FROM python:3.10

# 作業ディレクトリを /app に設定
WORKDIR /app

# 依存関係のインストール
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt 

RUN apt -y update && apt -y install libopencv-dev && apt -y install ffmpeg && rm -rf /var/lib/apt/lists/* -f

# RUN groupadd --gid 1000 user \
#     && useradd --uid 1000 --gid 1000 -m user

# RUN getent group video || groupadd -r video \
#     && useradd -m -s /bin/bash -u 1000 -G video user
# videoグループがなければ作る
RUN getent group video || groupadd -r video

# userをvideoグループ付きで作成（1回だけ！）
RUN useradd -m -s /bin/bash -u 1000 -G video user
   
# ソースコード（tests ディレクトリのみ）をコンテナにコピー
COPY test/ test/

USER user
# サーバーの起動コマンド
CMD ["uvicorn", "test.test_main:app", "--host", "0.0.0.0", "--port", "80", "--reload"]
