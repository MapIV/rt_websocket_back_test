import asyncio
import os
import struct
import threading
from fastapi.responses import StreamingResponse
from rtWebsocket.middleware.timeout import TimeoutMiddleware
from fastapi import FastAPI, Query, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import json
import cv2
import base64
import rtWebsocket
import time
import rtWebsocket

import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

latest_frame = None
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
camera_manager = rtWebsocket.setup_manager()
camera2_manager = rtWebsocket.setup_manager()   

# for test
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    import logging
    logging.error("カメラが開けませんでした。/dev/video0 にアクセスできない可能性があります。")
# -------------------- カメラ読み取りスレッド --------------------
def capture_thread():
    global latest_frame
    while True:
        ret, frame = cap.read()
        if ret:
            latest_frame = frame

threading.Thread(target=capture_thread, daemon=True).start()


# -------------------- カメラ画像送信用関数 --------------------
async def handle_camera(websocket: WebSocket):
    global latest_frame
    if latest_frame is None:
        logger.error("No frame captured")
        return
    
    ret, buffer = cv2.imencode(".jpg", latest_frame)
    if not ret:
        logger.error("Failed to encode image")
        return

    image_bytes = buffer.tobytes()
    header = {
        "format": "jpeg",
        "send_timestamp": int(time.time() * 1000)
    }

    # 画像のサイズを取得
    header_json = json.dumps(header).encode("utf-8")
    header_len = struct.pack("<I", len(header_json))
    payload = header_len + header_json + image_bytes

    await websocket.send_bytes(payload)
    
latest_frame = None
async def video_streamer(file_path: str, chunk_size: int = 1024 * 1024):
    """動画をチャンクごとにストリーミングする"""
    with open(file_path, "rb") as video_file:
        # yield from video_file
        while chunk := video_file.read(chunk_size):
            yield chunk

@app.get("/")
async def read_root():
    return {"message": "Hello World!"}
@app.websocket("/ws")
async def test_websocket(websocket: WebSocket):
    try:
        print("test_websocket")
        await rtWebsocket.websocket_endpoint(websocket, ws_manager)
    except Exception as e:
        print(f"test_websocket error {e}")

@app.websocket("/ws/webcamera")
async def camera_websocket(websocket: WebSocket):
    try:
        print("camera_websocket")
        await rtWebsocket.websocket_endpoint(websocket, camera_manager)
    except Exception as e:
        print(f"test_websocket error {e}")

@app.websocket("/ws/webcamera/sender")
async def camera_websocket_sender(websocket: WebSocket):
    try:
        print("camera_websocket")
        await rtWebsocket.websocket_endpoint(websocket, camera_manager, is_sender=True)
    except Exception as e:
        print(f"test_websocket error {e}")


@app.websocket("/ws/2/webcamera")
async def camera_websocket2(websocket: WebSocket):
    try:
        print("camera_websocket")
        await rtWebsocket.websocket_endpoint(websocket, camera2_manager)
    except Exception as e:
        print(f"test_websocket error {e}")

@app.websocket("/ws/2/webcamera/sender")
async def camera_websocket2_sender(websocket: WebSocket):
    try:
        print("camera_websocket")
        await rtWebsocket.websocket_endpoint(websocket, camera2_manager, is_sender=True)
    except Exception as e:
        print(f"test_websocket error {e}")

@app.get("/video")
async def video_feed(video_path: str = Query(..., description="Path to the video file")):
    if not os.path.exists(video_path):
        return {"error": "File not found"}
    return StreamingResponse(video_streamer(video_path),media_type="video/mp4")


# -------------------- test camera WebSocket エンドポイント --------------------
@app.websocket("/ws/camera")
async def websocket_camera_endpoint(websocket: WebSocket):
    logger.info("WebSocket camera 接続")
    await websocket.accept()
    try:
        while True:
            data_json = await websocket.receive_text()
            data = json.loads(data_json)

            topic = data.get("topic", "")
            frequency_ms = data.get("frequency", 1000)
            frequency_sec = frequency_ms / 1000

            if topic == "camera":
                    await handle_camera(websocket)
                    await asyncio.sleep(frequency_sec)
            else:
                await websocket.send_text(json.dumps({"error": f"Unknown topic: {topic}"}))
    except Exception as e:
        logger.error(f"WebSocket接続エラー: {e}")
    finally:
        await websocket.close()
        cap.release()  
        
# if __name__ == "__main__":
    
#     import uvicorn
    
#     uvicorn.run(app, host="0.0.0.0", port=8888)