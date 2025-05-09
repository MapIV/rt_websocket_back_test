import * as React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { initWebsocket, registerVideoUrlCallback } from "../api/websocket";

export default function ThermalVideoCard() {
  const [videoUrl, setVideoUrl] = React.useState(null);
  React.useEffect(() => {
    registerVideoUrlCallback(setVideoUrl);
    initWebsocket("thermal_camera", 0);
  }, []);

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        position: "relative",
      }}
    >
      {/* <Typography
          gutterBottom
          sx={{ color: "text.secondary", fontSize: { xs: "1.5rem", lg: 30 } }}
        >
          Thermal camera
        </Typography> */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {/* <video controls autoPlay width="90%"> */}
          {/* {videoUrl && (
            <source
              src={`http://192.168.100.158:8080/video?video_path=${videoUrl}`}
              type="video/mp4"
            />
          )} */}
          {/* <source
            src={`http://192.168.100.158:8080/video?video_path=/app/test/sample_sound_video/test.mp4`}
            type="video/mp4"
          /> */}
        {/* </video> */}
        <Box
            component="img"
            id="thermal_camera_feed"
            alt="thermalCameraImg"
            sx={{
                width: "90%",
                height:"90%",
            
                display: "block",
                objectFit: "contain",
            }}
        />
      </Box>
    </Card>
  );
}
