import * as React from "react";
// import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
// import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CameraWindow from "./cameraWindow";


export default function VideoCard() {
  return (
    <Card sx={{ height:"100%" ,minWidth: { lg: 275 }}}>
      <CardContent sx={{ height:"100%",display: "flex", justifyContent: "center", alignItems: "center" }}>
        {/* <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 30 }}>
          camera
        </Typography> */}
        <CameraWindow  />
      </CardContent>
    </Card>
  );
}
