import ReconnectingWebSocket from "reconnecting-websocket";
let ws_map = {};
const MAPIV_IP="ws://localhost:80/ws"
let isProcessing = false;
export const initWebsocket = (topic, frequency) => {
  if (ws_map[topic]) return;

  if (topic === "thermal_camera") {
    ws_map[topic] = new ReconnectingWebSocket(`${MAPIV_IP}/webcamera`);
  } else if (topic === "camera"){
    ws_map[topic] = new ReconnectingWebSocket(`${MAPIV_IP}/camera`);
  } else {
    ws_map[topic] = new ReconnectingWebSocket(MAPIV_IP);
  }

  ws_map[topic].onopen = () => {
    console.log("WebSocket connected");
    
    subscribe(topic, frequency);
  };

  ws_map[topic].onmessage = async (event) => {    
    try {
      if (topic === "camera") {
        await handleCameraData(event, topic, frequency);
      } else if (topic === "thermal_camera") {
        await handleThermalCameraData(event, topic, frequency);
      } else {
        const json = JSON.parse(event.data);
        switch (topic) {
          case "text":
            await handleTextData(json, topic, frequency);
            break;
          case "diagnostics":
            await handleDiagnosticsData(json, topic, frequency);
            break;
          case "video":
            await handleVideoURLData(json, topic, frequency);
            break;
          case "events":
            await handleEvents(json, topic, frequency);
            break;
          default:
            console.warn("Unhandled topic:", topic);
            break;
        }
      }
    } catch (e) {
      console.error("Error parsing message:", e);
    }
  };

  ws_map[topic].onclose = () => console.log("WebSocket closed");
  ws_map[topic].onerror = (error) => console.error("WebSocket error:", error);
};

const subscribe = (topic, frequency) => {
  console.log("subscribing to topic:", topic);
  ws_map[topic]?.send(JSON.stringify({ type: "subscribe", topic, "frequency":frequency }));
};

const requestData = (topic, frequency) => {
  ws_map[topic]?.send(JSON.stringify({ type: "request_data", topic, "frequency":frequency }));
};

async function handleTextData(json, topic, frequency) {
  requestData(topic, frequency);
}

async function createObjectURL(data) {
  const arrayBuffer = await data.arrayBuffer();

  const headerLenBytes = arrayBuffer.slice(0, 4);
  const headerLen = new DataView(
  headerLenBytes instanceof ArrayBuffer ? headerLenBytes : headerLenBytes).getUint32(0, true);
  
  const headerBytes = arrayBuffer.slice(4, 4 + headerLen);
  const headerText = new TextDecoder().decode(
  headerBytes instanceof ArrayBuffer ? headerBytes : headerBytes);
  const header = JSON.parse(headerText);

  const frameBytes = await arrayBuffer.slice(4 + headerLen)
  const mimeType = header.format === "png" ? "image/png" : "image/jpeg";
  
  const blob = new Blob([frameBytes], { type: mimeType });
  return  URL.createObjectURL(blob);

}

async function handleCameraData(event,topic,frequency) {
  if (event.data.byteLength === 0 || !(event.data instanceof Blob)) {
    console.log("No data received or data is not a Blob");
    return;
  }

  const objectUrl = await createObjectURL(event.data);
  const imgEl = document.getElementById("camera_feed");
  if (imgEl) {
    imgEl.src = objectUrl;
  }
  requestData(topic, frequency);
}

async function handleThermalCameraData(event,topic,frequency) {
  if (event.data.byteLength === 0 || !(event.data instanceof Blob) || isProcessing) {
    return;
  }
  isProcessing = true;
  const objectUrl = await createObjectURL(event.data);
  const imgEl = document.getElementById("thermal_camera_feed");
  if (imgEl) {
    imgEl.src = objectUrl;
  }
  isProcessing = false;
  requestData(topic, frequency);
}


let diagnosticsCallback = null;
function setDiagnosticsData(value) {
  if (diagnosticsCallback) {
    diagnosticsCallback(value);
  }
}
export function registerDiagnosticsCallback(set) {
  diagnosticsCallback = set;
}
const formatTimestamp=(epoch)=>{
  
  const date = new Date(epoch * 1000); // 秒 → ミリ秒変換

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 0〜11なので +1
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return {
    year,
    month,
    day,
    hours,
    minutes,
    seconds
  };
}

async function handleDiagnosticsData(diagnostics,topic,frequency) {
  
  const diagnosticsByName = {"names":[],"timestamp":{}};
  
  diagnostics["diagnostics_data"].forEach((diagnostic) => {
    diagnosticsByName["names"].push({
      name: diagnostic.name,
      level: diagnostic.level,
      message: diagnostic.message,
      unit: diagnostic.unit,
      value: diagnostic.value,
      threshold: diagnostic.threshold,
      stale_time: diagnostic.stale_time,
      icon: diagnostic.icon,
    });
  });
  diagnosticsByName["timestamp"]={"formatted":formatTimestamp(diagnostics["timestamp"]),"raw":diagnostics["timestamp"]};
  
  setDiagnosticsData(diagnosticsByName)
  
  requestData(topic, frequency);
}
let videoUrlCallback = null;
export function registerVideoUrlCallback(set) {
  videoUrlCallback= set;
}
function setVideoUrl(value) {
  if (videoUrlCallback) {
    videoUrlCallback(value);
  }
}
async function handleVideoURLData(url,topic,frequency) {  
  setVideoUrl(url["video_url"]);
}

let EventsCallback = null;
export function registerEventsCallback(set) {
  EventsCallback= set;
}
function setEvents(value) {
  if (videoUrlCallback) {
    EventsCallback(value);
  }
}
async function handleEvents(rows,topic,frequency) {
  setEvents(rows);
}
export function sendJoystickData(data) {
  
  ws_map["joystick"]?.send(JSON.stringify({ type: "send_data", topic:"joystick",linear:data.linear,angular:data.angular,"timestamp":data.timestamp}));
}