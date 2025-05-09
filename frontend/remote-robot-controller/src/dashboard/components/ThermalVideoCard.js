import * as React from "react";
// import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
// import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { initWebsocket, registerVideoUrlCallback } from "../api/websocket";

const mediaQuery = window.matchMedia("(max-width: 768px)");
const Smartphone = mediaQuery.matches;
const CardHeight = Smartphone ? 280 : 500;

export default function ThermalVideoCard() {
  const [videoUrl, setVideoUrl] = React.useState(null);
  React.useEffect(() => {
    registerVideoUrlCallback(setVideoUrl);
    initWebsocket("video", "dammy");
  }, []);

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
            alignItems: "center",
        height: CardHeight,
        minWidth: 222,
        marginTop: { xs: 0, lg: 2 },
        position: "relative",
      }}
    >
        <Typography
          gutterBottom
          sx={{ color: "text.secondary", fontSize: { xs: "1.5rem", lg: 30 } }}
        >
          Thermal camera
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: CardHeight - 56,
            overflow: "hidden",
          }}
        >
          <video controls autoPlay width="90%">
            {videoUrl && (
              <source
                src={`http://192.168.100.147:8080/video?video_path=${videoUrl}`}
                type="video/mp4"
              />
            )}
          </video>
        </Box>
    </Card>
  );
}
