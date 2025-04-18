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

# from aiortc import VideoStreamTrack, RTCPeerConnection, RTCSessionDescription
# from aiortc.contrib.media import MediaPlayer, MediaRecorder
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
cap=""
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """シンプルなWebSocketエンドポイント"""
    await websocket.accept()  # クライアントの接続を受け入れる
    cap = cv2.VideoCapture(0)  # WebSocket セッションごとにカメラを開く
            
    try:
        while True:
            data_json = await websocket.receive_text()  # クライアントからのメッセージを受信
            
            data = json.loads(data_json)
            topic = data.get("topic", "")

            # print(f"受信: {data}")  # 受信データを表示（ログ代わり）

            if topic == "camera":
                # cap = cv2.VideoCapture(0)  # WebSocket セッションごとにカメラを開く
                ret, frame = cap.read()
                if ret:
                    # 画像を JPEG に変換して Base64 エンコード
                    _, buffer = cv2.imencode(".jpg", frame)
                    frame_base64 = base64.b64encode(buffer).decode("utf-8")

                    # WebSocket で送信
                    # print(frame_base64)
              
                    await websocket.send_text(json.dumps({"image": frame_base64}))
                
                else:
                    break
            if topic=="video":
                video_url="/app/test/sample_sound_video/test.mp4"
                print(f"video_url: {video_url}")
                await websocket.send_text(json.dumps({"video_url": video_url}))
            if topic=="diagnostics":
                #testData
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
                await websocket.send_text(json.dumps(test_data))
    except Exception as e:
      
        print(f"WebSocket接続エラー: {e}")  # エラーが発生したら表示
    finally:
        # cap.release()  # カメラリソースを解放
        await websocket.close()  # WebSocket を閉じる


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