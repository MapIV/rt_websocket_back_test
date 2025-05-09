import * as React from "react";
// import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
// import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CameraWindow from "./cameraWindow";

const mediaQuery = window.matchMedia("(max-width: 768px)");
const Smartphone = mediaQuery.matches;
const CardHeight = Smartphone ? 280 : 500;

const TypographyHeight = 100; // タイトルの高さ（余白込み）
const AdjustedCardHeight = CardHeight - TypographyHeight;

export default function VideoCard() {
  return (
    <Card sx={{ height: CardHeight, minWidth: { lg: 275 }, marginTop: {xs:0,lg: 2} }}>
      <CardContent>
        <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 30 }}>
          camera
        </Typography>
        <CameraWindow CardHeight={AdjustedCardHeight} />
      </CardContent>
    </Card>
  );
}
