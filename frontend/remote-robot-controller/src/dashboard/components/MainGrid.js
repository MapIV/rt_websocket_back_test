import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import VideoCard from "./VideoCard";
import ThermalVideoCard from "./ThermalVideoCard";
import MapCard from "./MapCard";
import MiniEventList from "./MiniEventList";
import EmergencyButton from "./EmergencyStop";
import StatusCard from "./StatusCard";
import { Button, Typography, useMediaQuery } from "@mui/material";
import { useState } from "react";
import JoyStickWindow from "./JoystickWindow";
import { initWebsocket, registerDiagnosticsCallback } from "../api/websocket";
import MobileStatusCard from "./MobileStatusCard";
import ModeChangeSwitch from "./ModeChangeSwitch";
import { useTheme } from "@emotion/react";
import ManualModeWindow from "./ManualModeWindow";

export default function MainGrid() {
  const [ThermalCamera, SwitchCamera] = useState(false);
  const toggle = () => SwitchCamera(!ThermalCamera);
  const [isManual, setIsManual] = useState(false);
  const modeSwitch = () => {

    setIsManual((prev) => !prev);
  }

  const [diagnosticsData, setdiagnosticsData] = React.useState(null);
  const responsiveHeights = {
    height: {
      xs: "300px",
      sm: "400px",
      md:"500px",
      lg: "500px",
    },
  };

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  React.useEffect(() => {
    registerDiagnosticsCallback(setdiagnosticsData);
    initWebsocket("diagnostics", 100);
  }, []);
  return isXs && isManual ? (
    <Box sx={{ userSelect: "none", overflow: "hidden" }}>
      <ManualModeWindow
        isManual={isManual}
        modeSwitch={modeSwitch}
        diagnosticsData={diagnosticsData}
      />
    </Box>
  ) : (
    <Box
      sx={{
        width: "100%",
        pt: { xs: 8, md: 0 },
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100vw",
          justifyContent: "center",
          flexWrap: "wrap",
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Box
          width={{ xs: "90%", sm: "45%", lg: "30%" }}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={2}
          sx={responsiveHeights}
        >
          <Box
            width={"10%"}
            height={"100%"}
            flexDirection={"column"}
            justifyContent={"space-around"}
            display={{ xs: "flex", sm: "none" }}
          >
            <MobileStatusCard diagnosticsData={diagnosticsData} />
          </Box>

          <Box
            width={{ xs: "85%", sm: "100%" }}
            height={"100%"}
            display={{ xs: ThermalCamera ? "none" : "block", sm: "block" }}
          >
            <VideoCard />
          </Box>
        </Box>

        <Box
          width={{ xs: "85%", sm: "45%", lg: "30%" }}
          sx={responsiveHeights}
          display={{ xs: ThermalCamera ? "block" : "none", sm: "block" }}
        >
          <ThermalVideoCard />
        </Box>
        <Box display={{ xs: "block", sm: "none" }}>
          <ModeChangeSwitch isManual={isManual} modeSwitch={modeSwitch} />
        </Box>
        <Box
          sx={{
            display: { xs: "flex", sm: "none" },
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box display={{ xs: "block", sm: "none" }}>
            <Box sx={{ "& button": { m: 1 } }}>
              <Button
                variant="outlined"
                color="info"
                size="small"
                onClick={toggle}
              >
                {ThermalCamera ? "Normal" : "Thermal"}
              </Button>
            </Box>
          </Box>
        </Box>

        <Box
          width={{ xs: "90%", sm: "45%", lg: "30%" }}
          sx={responsiveHeights}
        >
          <MapCard />
        </Box>
       

        <Box
          width={{ xs: "100%", sm: "45%", lg: "30%" }}
          display={{ xs: "none", sm: "block" }}
          sx={responsiveHeights}
        >
          {/* <CustomizedTreeView /> */}
          <StatusCard diagnosticsData={diagnosticsData} />
        </Box>
        <Box
          width={{ xs: "100%", sm: "45%", lg: "30%" }}
          display={{ xs: "none", sm: "block" }}
        >
          <Stack width="100%" alignItems="center" sx={{ mt: { xs: 1, lg: 5 } }}>
            <ModeChangeSwitch isManual={isManual} modeSwitch={modeSwitch} />
            <Box sx={{ mt: { xs: 1, lg: 5 } }}>
              <JoyStickWindow isManual={isManual}/>
            </Box>
            <Box sx={{ mt: { xs: 1, lg: 5 } }}>
              <Typography
                sx={{
                  fontSize: 28,
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                MODE :{" "}
                <Box sx={{ color: isManual ? "warning.main" : "primary.main" }}>
                  {isManual ? "MANUAL" : "AUTO"}
                </Box>
              </Typography>
            </Box>
          </Stack>
        </Box>
        <Box
          width={{ xs: "90%", sm: "45%", lg: "30%" }}
          sx={responsiveHeights}
          display={{ xs: "block", sm: "block" }}
        >
          {/* <CustomizedDataBox /> */}
          <MiniEventList />
        </Box>
        <Box
          sx={{
            position: {
              xs: "fixed",
              lg: "relative",
            },
            top: {
              xs: 0,
            },
            left: {
              xs: 0,
            },
            zIndex: 999,
          }}
        >
          <EmergencyButton />
          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: "bold",
              justifyContent: "center",
              display: { xs: "flex", sm: "none" },
            }}
          >
            MODE :{" "}
            <Box sx={{ color: isManual ? "warning.main" : "primary.main" }}>
              {isManual ? "MANUAL" : "AUTO"}
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
