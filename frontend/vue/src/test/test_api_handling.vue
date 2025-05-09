<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import PcdViewer from './pcdViewer.vue';
import { BSON } from 'bson';
import { array, buffer } from 'three/tsl';
import { ByteType } from 'three';
const ws_map = ref<{ [key: string]: WebSocket | null }>({ video_stream: null, pcdfile: null });
const viewer = ref<Viewer | null>(null)
const imgBlobUrl = ref<string | null>(null);
// const videoElement = ref<HTMLVideoElement | null>(null);
const mediaSource = ref<MediaSource | null>(null);
const sourceBuffer = ref<SourceBuffer | null>(null);
const frontend_url = "robot-controller.map4.jp";
const backend_url="api.robot-controller.map4.jp";
const bufferQueue = ref<ArrayBuffer[]>([]);
  let stream: MediaStream | null = null;
  let intervalId: number | null = null;
let isProcessing = false;
let text = ref<string>('');
interface Viewer {
  createPointCloud: (points: Float32Array, fields:string[], fieldData?: Float32Array) => void;
}
async function startCameraAndSend(format = "jpg") {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const video = document.getElementById("myCam") as HTMLVideoElement;
  video.srcObject = stream;
  await video.play();

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;

  // 定期的にフレームを送信（ここでは200msごと）
  intervalId = window.setInterval(async () => {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const buffer = await blob.arrayBuffer();

      const send_timestamp = Date.now();
      const header = {
        format: format, // "jpg" など
        send_timestamp: send_timestamp,
      };
      const header_bytes = new TextEncoder().encode(JSON.stringify(header));
      const header_len = new Uint8Array(new Uint32Array([header_bytes.length]).buffer); // 4byte little-endian

      const payload = new Uint8Array(header_len.length + header_bytes.length + buffer.byteLength);
      payload.set(header_len, 0);
      payload.set(header_bytes, 4);
      payload.set(new Uint8Array(buffer), 4 + header_bytes.length);

      ws_map.value["video_stream"]?.send(payload);
    }, `image/${format}`);
  }, 200); // 200ms ごとに送信
}

function stopCameraAndSending() {
  stream?.getTracks().forEach(track => track.stop());
  if (intervalId !== null) {
    clearInterval(intervalId);
  }
}

function initWebsocket(topic: string,path: string) {
  if (ws_map.value[topic]) return; 
  if (path === "webcamera") {
    ws_map.value[topic] = new WebSocket(`wss://${backend_url}/ws/webcamera`); // test
  } else {
    ws_map.value[topic] = new WebSocket(`wss://${backend_url}/ws`);
    console.log(`wss://${backend_url}/ws`);
  }

  ws_map.value[topic].onopen = () => {
    console.log("Websocket connected");
    if (path === "webcamera") {
      console.log("webcamera");
    } else {
      subscribe(topic,path);

    // request first data
    }
    requestData(topic,path);
  };

  ws_map.value[topic].onmessage = async (event) => {
    console.log("Received message:", event.data);
    console.log("topic:", topic);
    try {
      if (topic === "video_stream") {
        await create_video(event, topic,path);
      }

      if (topic === "pcdfile") {
        await create_pcd(event, topic,path);
      }
      if (topic === "text") {
        await create_text(event, topic, path);
      }
    }
    catch (e) {
      console.error("Error parsing message: " + e);
    }
  };

  ws_map.value[topic].onclose = () => {
    console.log("Websocket closed");
  };

  ws_map.value[topic].onerror = (error) => {
    console.error("Websocket error: " + error);
  };
}

function subscribe(topic : string,path: string) {
  console.log("subscribe topic: ", topic);
  if (ws_map.value[topic]) {
      ws_map.value[topic].send(JSON.stringify({
          type: "subscribe",
          topic: topic,
          path: path,
      }));
    }
}

function requestData(topic: string,path: string) {
  if (ws_map.value[topic]) {
    ws_map.value[topic].send(JSON.stringify({
        type: "request_data",
        topic: topic,
        path: path,
    }));
  }
}

async function create_video (event: MessageEvent<any>,topic: string,path: string) {
  // requestData(topic,path);
  if (event.data.byteLength === 0 || !(event.data instanceof Blob) || isProcessing) {
    return;
  }
  isProcessing = true;
  const now = Date.now();
  const arrayBuffer = await event.data.arrayBuffer();
  const headerLenBytes = arrayBuffer.slice(0, 4);
  const headerLen = new DataView(
  headerLenBytes instanceof ArrayBuffer ? headerLenBytes : headerLenBytes
).getUint32(0, true);

  const headerBytes = arrayBuffer.slice(4, 4 + headerLen);
  const headerText = new TextDecoder().decode(
  headerBytes instanceof ArrayBuffer ? headerBytes : headerBytes
);
  const header = JSON.parse(headerText);

  const sendTs = header.send_timestamp;
  const receiveTs = header.receive_timestamp;
  const roundTrip = now - sendTs;
  const serverDelay = receiveTs - sendTs;
  const clientDelay = now - receiveTs;

  console.log("Video timestamps:", { sendTs, receiveTs, now });
  console.log(`Total: ${roundTrip}ms | Server: ${serverDelay}ms | Client: ${clientDelay}ms`);

  // 描画用メタデータにも表示可能
  text.value = `RTT: ${roundTrip}ms (Server: ${serverDelay}ms, Client: ${clientDelay}ms)`;

  const frameBytes = await arrayBuffer.slice(4 + headerLen)
  const mimeType = header.format === "png" ? "image/png" : "image/jpeg";
  
  const blob = new Blob([frameBytes], { type: mimeType });
  const objectUrl = URL.createObjectURL(blob);
  const imgEl = document.getElementById("imgTest") as HTMLImageElement;
  if (imgEl) {
    imgEl.src = objectUrl;
  }
  console.log("topic,path",topic,path);
  // requestData(topic,path);
  isProcessing = false;
}

async function create_pcd (event: MessageEvent, topic: string,path: string) {
  console.log("Received PCD file time: ", new Date().getTime());
  const arrayBuffer = await event.data.arrayBuffer();

  // read header length
  const headerLengthbyte = arrayBuffer.slice(0,4);
  const headerLengthInt = new DataView(headerLengthbyte).getInt32(0, true);
  console.log("headerLength : ", headerLengthInt);

  // read header
  const headerbytes = arrayBuffer.slice(4,4+headerLengthInt);
  const headerText = new TextDecoder("utf-8").decode(headerbytes);
  const header = JSON.parse(headerText);
  console.log("header : ", header);

  // Get points and field data lengths from header
  const pointsLength = header.points_length;
  const fieldLength = header.field_length;
  const fields = header.fields;

  // Extract points data
  const pointsStart = 4 + headerLengthInt;
  const pointsBuffer = arrayBuffer.slice(pointsStart, pointsStart + pointsLength);
  const positions = new Float32Array(pointsBuffer);
  
  // Extract field data if available
  let fieldData = new Float32Array(0);
  if (fieldLength > 0) {
    const fieldStart = pointsStart + pointsLength;
    const fieldBuffer = arrayBuffer.slice(fieldStart, fieldStart + fieldLength);
    fieldData = new Float32Array(fieldBuffer);
  }
  console.log("fieldData.length : ", fieldData.length);
  console.log("points.length : ", positions.length);
  console.log("fields : ", fields );

  if (viewer.value) {
    if (fieldData.length > 0) {
      viewer.value.createPointCloud(positions, fields,fieldData,);
    } else {
    viewer.value.createPointCloud(positions, fields);
    }
  }
  console.log("finish create pcd time : ", new Date().getTime());
  requestData(topic,path);
}

async function create_text (event: MessageEvent, topic: string, path: string) {

  const json = JSON.parse(event.data);
  console.log("Received JSON data:", json);
  // console.log("header:", json.header);
  // console.log("data:", json.data);
  text.value = json.data;
  requestData(topic, path);
}


onMounted(() => {
  initWebsocket("video_stream","webcamera"); // docker container内のパス
  // initWebsocket("pcdfile","./test/sample_pcdfile/map-18400_-93500_converted_converted.pcd");// docker container内のパス
  // initWebsocket("text","test_path");// docker container内のパス
//   startCameraAndSend("jpg");
});

onUnmounted(() => {
  if (ws_map.value) {
    for (const key in ws_map.value) {
      if (ws_map.value[key]) {
        ws_map.value[key]?.close();
      }
    }
  }
});
</script>

<template>
  <h1>test1</h1>
  <video id="myCam" width="320" height="240" autoplay muted></video>
  <video id="streamVideo" width="320" height="240" autoplay controls></video>
  <canvas id="videoCanvas" width="1000" height="100"></canvas>
  <img id="imgTest"  width="1000" style="background-color: black;"/>
  <h1>test1</h1>
  <div>{{text}}</div>
  <button v-on:click="stopCameraAndSending"></button>
  
  <h1>test2</h1>
  <PcdViewer ref="viewer"/>

</template>


