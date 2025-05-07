import os
from fastapi.responses import StreamingResponse
from rtWebsocket.middleware.timeout import TimeoutMiddleware
from fastapi import FastAPI, Query, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import json
import cv2
import base64
import rtWebsocket
import time

app = FastAPI()

# CORS 設定（必要に応じて）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(TimeoutMiddleware, timeout=10)
ws_manager = rtWebsocket.setup_manager()

async def video_streamer(file_path: str, chunk_size: int = 1024 * 1024):
    """動画をチャンクごとにストリーミングする"""
    with open(file_path, "rb") as video_file:
        # yield from video_file
        while chunk := video_file.read(chunk_size):
            yield chunk

@app.get("/")
async def read_root():
    return {"message": "Hello World!"}

                # ウェブカメラのキャプチャを開始
import asyncio
import json
import time
import cv2
import base64
from fastapi import WebSocket



# グローバルにカメラインスタンスを保持（必要ならセッションごとに変更も可）
# 各トピックごとの処理を関数に分離
cap = cv2.VideoCapture(0)

latest_frame = None

def capture_thread():
    global latest_frame
    while True:
        ret, frame = cap.read()
        if ret:
            latest_frame = frame

# 起動時にこのスレッドを開始しておく
import threading
threading.Thread(target=capture_thread, daemon=True).start()

async def handle_camera(websocket: WebSocket):
    # ret, frame = get_latest_frame(cap)
    # if ret:
        _, buffer = cv2.imencode(".jpg", latest_frame)
        frame_base64 = base64.b64encode(buffer).decode("utf-8")
        await websocket.send_text(json.dumps({"image": frame_base64}))
    # else:
    #     await websocket.send_text(json.dumps({"error": "カメラ画像取得失敗"}))

async def handle_video(websocket: WebSocket):
    video_url = "/app/test/sample_sound_video/test.mp4"
    # print(f"video_url: {video_url}")
    await websocket.send_text(json.dumps({"video_url": video_url}))

async def handle_diagnostics(websocket: WebSocket):
    current_timestamp = int(time.time())

    test_data={
                    "topic": "diagnostics",
                  #   "timestamp": "EPOCH",
                    "timestamp": current_timestamp,#test data
                    "diagnostics_data": [
                      {
                        "level": 0,
                        "name": "camera",
                        "message": "OK",
                        "icon": "camera",
                        "threshold": [1.0, 4.0,6.0],
                        "stale_time": 3,
                        "unit": "hz",
                        "value": 5,
                      },
                      {
                        "level": 1,
                        "name": "thermo_camera",
                        "message": "WARNING: Low Camera frequency",
                        "icon": "thermo",
                        "threshold": [1.0, 4.0,6.0],
                        "stale_time": 5,
                        "unit": "hz",
                        "value": 1,
                      },
                      {
                        "level": 2,
                        "name": "storage",
                        "message": "ERROR: SSD not connected",
                        "icon": "storage",
                        "threshold": [1.0, 4.0,6.0],
                        "stale_time": 10,
                        "unit": "percent",
                        "value": 15,
                      },
                      #テストで増やす
                        {
                        "level": 0,
                        "name": "battery",
                        "message": "OK",
                        "icon": "battery",
                        "threshold": [1.0, 4.0,6.0],
                        "stale_time": 33,
                        "unit": "percent",
                        "value": 5,
                      },
                      {
                        "level": 0,
                        "name": "battery",
                        "message": "OK",
                        "icon": "battery",
                        "threshold": [1.0, 4.0,6.0],
                        "stale_time": 20,
                        "unit": "percent",
                        "value": 5,
                      },
                      {
                        "level": 0,
                        "name": "battery",
                        "message": "OK",
                        "icon": "battery",
                        "threshold": [1.0, 4.0,6.0],
                        "stale_time": 5,
                        "unit": "percent",
                        "value": 5,
                      },
                    ]
                  }
# from aiortc import VideoStreamTrack, RTCPeerConnection, RTCSessionDescription
# from aiortc.contrib.media import MediaPlayer, MediaRecorder
    await websocket.send_text(json.dumps(test_data))


async def handle_events(websocket: WebSocket):
  rows = [
    { "id": 1, "date": "2/18", "time": "12:00", "event": "Battery", "location": "栄" },
    { "id": 2, "date": "2/18", "time": "11:30", "event": "Arrival", "location": "伏見" },
    { "id": 3, "date": "2/18", "time": "11:00", "event": "Manual Mode", "location": "名古屋" },
    { "id": 4, "date": "2/18", "time": "10:30", "event": "Storage", "location": "池下" },
    { "id": 5, "date": "2/18", "time": "10:00", "event": "Route", "location": "今池" },
]

  await websocket.send_text(json.dumps(rows))


# トピックと関数のマッピング
topic_handlers = {
    "camera": handle_camera,
    "video": handle_video,
    "diagnostics": handle_diagnostics,
    "events":handle_events,
}

# WebSocket エンドポイント
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    try:
        while True:
            data_json = await websocket.receive_text()
            data = json.loads(data_json)
            topic = data.get("topic", "")
            frequency_ms = data.get("frequency", 1000)  # デフォルトは1000ms
            frequency_sec = frequency_ms / 1000  # ミリ秒を秒に変換
            # print(f"topic: {topic}, frequency: {frequency_sec}秒")
            handler = topic_handlers.get(topic)
            if handler:
                while True:
                    await handler(websocket)
                    await asyncio.sleep(frequency_sec)  # frequency_sec秒ごとにデータを送信
            elif topic == "joystick":
                # ジョイスティックのデータを受信
                linear = data.get("linear", {})
                angular = data.get("angular", {})
                # ここでジョイスティックのデータを処理する
                print(f"linear: {linear}, angular: {angular}")
            else:
                await websocket.send_text(json.dumps({"error": f"不明なトピック: {topic}"}))

    except Exception as e:
        print(f"WebSocket接続エラー: {e}")
    finally:
        await websocket.close()
        # cap.release()  # 使用後にカメラを解放する場合はこの行を有効にしてください


# @app.websocket("/ws")
# async def test_websocket(websocket: WebSocket):
#     try:
#         print("test_websocket")
#         await rtWebsocket.websocket_endpoint(websocket, ws_manager)
#     except Exception as e:
#         print(f"test_websocket error {e}")

@app.get("/video")
async def video_feed(video_path: str = Query(..., description="Path to the video file")):
    print(f"video_path: {video_path}")
    if not os.path.exists(video_path):
        return {"error": "File not found"}
    return StreamingResponse(video_streamer(video_path),media_type="video/mp4")


if __name__ == "__main__":
    
    import uvicorn
    
    uvicorn.run(app, host="0.0.0.0", port=8080)