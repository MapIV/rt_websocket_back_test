#!/bin/bash

# backend のビルド
cd backend
./build.sh

# frontend のビルド
cd ../frontend
./build.sh

# docker-compose を使って起動
cd ..
docker compose -f docker-compose.deploy.yaml up 