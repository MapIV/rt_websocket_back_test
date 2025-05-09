import ReconnectingWebSocket from "reconnecting-websocket";
let ws_map = {};
const MAPIV_IP="ws://192.168.100.158:8080/ws"
export const initWebsocket = (topic, frequency) => {
  if (ws_map[topic]) return;
  ws_map[topic] = new ReconnectingWebSocket(MAPIV_IP);

  ws_map[topic].onopen = () => {
    console.log("WebSocket connected");
    
    subscribe(topic, frequency);
  };

  ws_map[topic].onmessage = async (event) => {    
    try {
      const json = JSON.parse(event.data);
      
      switch (topic) {

        case "text":
          await handleTextData(json, topic, frequency);
          break;

        case "camera":
          await handleCameraData(json, topic,frequency);
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
          break;
      }
    } catch (e) {
      console.error("Error parsing message:", e);
    }
  };

  ws_map[topic].onclose = () => console.log("WebSocket closed");
  ws_map[topic].onerror = (error) => console.error("WebSocket error:", error);
};

const subscribe = (topic, frequency) => {
  ws_map[topic]?.send(JSON.stringify({ type: "subscribe", topic, "frequency":frequency }));
};

const requestData = (topic, frequency) => {
  // ws_map[topic]?.send(JSON.stringify({ type: "request_data", topic, "frequency":frequency }));
};

async function handleTextData(json, topic, frequency) {
  requestData(topic, frequency);
}

async function handleCameraData(json,topic,frequency) {
  if (json.image&&document.getElementById("camera_feed")) {
    document.getElementById("camera_feed").src = `data:image/jpeg;base64,${json.image}`;
  }
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