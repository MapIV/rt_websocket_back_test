import * as React from "react";
import CameraWindow from "./cameraWindow";
import { Box, Button } from "@mui/material";
import JoyStickWindow from "./JoystickWindow";
import ModeChangeSwitch from "./ModeChangeSwitch";
import MobileStatusCard from "./MobileStatusCard";
import DelayTime from "./DelayTime";

const mediaQuery = window.matchMedia("(max-width: 768px)");
const Smartphone = mediaQuery.matches;
const CardHeight = Smartphone ? 280 : 500;

const TypographyHeight = 100; // タイトルの高さ（余白込み）
const AdjustedCardHeight = CardHeight - TypographyHeight;

export default function ManualModeWindow({
  isManual,
  modeSwitch,
  diagnosticsData,
}) {
  return (
    <Box
      sx={{
        margin: 0,
        padding: 1,
        width: "100dvw",
        height: "100dvh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: "100dvw",
          transform: "rotate(90deg)",
          margin: 0,
          padding: 0,
          position: "absolute",
          top: "5%",
          right: 0,
        }}
      >
        <MobileStatusCard diagnosticsData={diagnosticsData} mode={isManual} />
      </Box>

      <Box
        sx={{
          minWidth: "77dvh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          transform: "rotate(90deg)",
          transformOrigin: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            bottom: "-5%",
            left: "2%",
            rotate: "-90deg",
            zIndex: 5,
          }}
        >
          <JoyStickWindow isManual={isManual}/>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            width:"90%",
          }}
        >
          <DelayTime delayTime={/**dammyData */ 10} />
          <ModeChangeSwitch isManual={isManual} modeSwitch={modeSwitch} />
          <Box sx={{ "& button": { m: { lg: 1 } } }}>
            <Button
              sx={{
                width:"40vw",
                height:"100%",
                backgroundColor: "rgb(255, 80, 80)",
                color: "white",
                "&:hover": {
                  backgroundColor: "#cc0000", // ホバー時も赤系にする
                },
              }}
              variant="contained" // ← outlined → contained に変更（背景色反映のため）
              size="small"
              color="secondary"
            >
              stop
            </Button>
          </Box>
        </Box>
        <CameraWindow CardHeight={AdjustedCardHeight} />
      </Box>
      <Box
        sx={{
          zIndex: 6,
          position: "absolute",
          bottom: "2%",
          left: "50%",
          translate: "-50% 0",
          transform: "rotate(90deg)",
        }}
      ></Box>
    </Box>
  );
}
