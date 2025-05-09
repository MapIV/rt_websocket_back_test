import * as React from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
// import { Joystick } from "react-joystick-component";
import VideoCard from "./VideoCard";
import ThermalVideoCard from "./ThermalVideoCard";
import MapCard from "./MapCard";
import MiniEventList from "./MiniEventList";
import EmergencyButton from "./EmergencyStop";
import EventPageButton from "./EventPageButton";
// import type { LatLngTuple } from 'leaflet'
// import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import StatusCard from "./StatusCard";
import { Button, Typography, useMediaQuery } from "@mui/material";
import { useState } from "react";
import JoyStickWindow from "./JoystickWindow";
import { initWebsocket, registerDiagnosticsCallback } from "../api/websocket";
import MobileStatusCard from "./MobileStatusCard";
import ModeChangeSwitch from "./ModeChangeSwitch";
import { useTheme } from "@emotion/react";
import ManualModeWindow from "./ManualModeWindow";

const mediaQuery = window.matchMedia("(max-width: 768px)");
const Smartphone = mediaQuery.matches;
const TopMargin = Smartphone ? 1 : 5;
// const position: LatLngTuple = [51.505, -0.09];

export default function MainGrid() {
  const [ThermalCamera, SwitchCamera] = useState(false);
  const toggle = () => SwitchCamera(!ThermalCamera);
  const [manual, setMode] = useState(false);
  const modeSwitch = () => setMode((prev) => !prev);

  const [diagnosticsData, setdiagnosticsData] = React.useState(null);

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  React.useEffect(() => {
    registerDiagnosticsCallback(setdiagnosticsData);
    initWebsocket("diagnostics", "dammy");
  }, []);
  return isXs && manual ? (
    <Box sx={{userSelect:"none",overflow:"hidden"}}>
      <ManualModeWindow checked={manual} modeSwitch={modeSwitch} diagnosticsData={diagnosticsData} />
    </Box>
  ) : (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
        pt: { xs: 8, md: 0 },
      }}
    >
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{
          mb: (theme) => theme.spacing(2),
          mt: (theme) => theme.spacing(2),
        }}
      >
        <Grid size={{ xs: 2, lg: 4 }} display={{ xs: "block", sm: "none" }}>
          <MobileStatusCard diagnosticsData={diagnosticsData} />
        </Grid>

        <Grid
          size={{ xs: 10, sm: 12, lg: 4 }}
          display={{ xs: ThermalCamera ? "none" : "block", sm: "block" }}
        >
          <VideoCard />
        </Grid>

        <Grid
          size={{ xs: 10, sm: 12, lg: 4 }}
          display={{ xs: ThermalCamera ? "block" : "none", sm: "block" }}
        >
          <ThermalVideoCard />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }} display={{ xs: "block", sm: "none" }}>
          <ModeChangeSwitch checked={manual} modeSwitch={modeSwitch} />
        </Grid>
        <Box
          sx={{
            display: { xs: "flex", sm: "none" },
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box size={{ xs: 4, lg: 4 }} display={{ xs: "block", sm: "none" }}>
            <EventPageButton />
          </Box>

          <Box size={{ xs: 4, lg: 4 }} display={{ xs: "block", sm: "none" }}>
            {/* <CameraChange ThermalCamera = 'Camera' /> */}
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

        <Grid size={{ xs: 12, lg: 4 }}>
          <MapCard />
          {/* <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
					<Marker position={position}>
						<Popup>
						A pretty CSS3 popup. <br />
						</Popup>
					</Marker>
					</MapContainer> */}
        </Grid>
      </Grid>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 6, lg: 4 }} display={{ xs: "none", sm: "block" }}>
          {/* <CustomizedTreeView /> */}
          <StatusCard diagnosticsData={diagnosticsData} />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }} display={{ xs: "none", sm: "block" }}>
          <Stack width="100%" alignItems="center" sx={{ mt: TopMargin }}>
            <ModeChangeSwitch checked={manual} modeSwitch={modeSwitch} />
            <Box sx={{ mt: TopMargin }}>
              <JoyStickWindow />
            </Box>
            <Box sx={{ mt: TopMargin }}>
              <Typography
                sx={{
                  fontSize: 28,
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                MODE :{" "}
                <Box sx={{ color: manual ? "warning.main" : "primary.main" }}>
                  {manual ? "MANUAL" : "AUTO"}
                </Box>
              </Typography>
            </Box>
          </Stack>
        </Grid>
        <Grid size={{ xs: 6, lg: 4 }} display={{ xs: "none", sm: "block" }}>
          {/* <CustomizedDataGrid /> */}
          <MiniEventList />
        </Grid>
      </Grid>
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
          zIndex: 100000000,
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
          <Box sx={{ color: manual ? "warning.main" : "primary.main" }}>
            {manual ? "MANUAL" : "AUTO"}
          </Box>
        </Typography>
      </Box>
      {/* <Copyright sx={{ my: 4 }} /> */}
    </Box>
  );
}
