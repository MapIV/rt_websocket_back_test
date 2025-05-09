import ReconnectingWebSocket from "reconnecting-websocket";
let ws_map = {};
const MAPIV_IP="192.168.100.147"
// const HOME_IP="192.168.0.11"
export const initWebsocket = (topic, path) => {
  if (ws_map[topic]) return;
  ws_map[topic] = new ReconnectingWebSocket(`ws://${MAPIV_IP}:8080/ws`);

  ws_map[topic].onopen = () => {
    console.log("WebSocket connected");
    
    subscribe(topic, path);
    // requestData(topic, path);
  };

  ws_map[topic].onmessage = async (event) => {    
    try {
      const json = JSON.parse(event.data);
      // console.log("Received JSON data:", json);
      
      switch (topic) {

        case "text":
          await handleTextData(json, topic, path);
          break;

        case "camera":
          await handleCameraData(json, topic,path);
          break;

        case "diagnostics":
          await handleDiagnosticsData(json, topic, path);
          break;

        case "video":
          await handleVideoURLData(json, topic, path);
          break;

        default:
          break;
      }
    } catch (e) {
      console.error("Error parsing message:", e);
    }
  };

  ws_map[topic].onclose = () => console.log("WebSocket closed");
  ws_map[topic].onerror = (error) => console.error("WebSocket error:", error);
};

const subscribe = (topic, path) => {
  ws_map[topic]?.send(JSON.stringify({ type: "subscribe", topic, path }));
};

const requestData = (topic, path) => {
  ws_map[topic]?.send(JSON.stringify({ type: "request_data", topic, path }));
};

async function handleTextData(json, topic, path) {
  // console.log("Header:", json.header);
  // console.log("Data:", json.data);
  requestData(topic, path);
}

async function handleCameraData(json,topic,path) {
  if (json.image&&document.getElementById("camera_feed")) {
    document.getElementById("camera_feed").src = `data:image/jpeg;base64,${json.image}`;
  }
  requestData(topic, path);
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
async function handleDiagnosticsData(diagnostics,topic,path) {
  
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
  
  requestData(topic, path);
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
async function handleVideoURLData(url,topic,path) {
  setVideoUrl(url["video_url"]);
}