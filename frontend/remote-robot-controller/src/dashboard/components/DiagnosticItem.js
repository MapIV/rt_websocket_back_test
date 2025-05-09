//icons
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import StorageIcon from "@mui/icons-material/Storage";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import { Box, Typography } from "@mui/material";
import LinearWithValueLabel from "./batterybar";
import {  useEffect, useState } from "react";
export default function DiagnosticItem({
  icon,
  threshold,
  title,
  stale_time,
  value,
  unit,
  total,
  timestamp,
}) {
  const [isStale, setIsStale] = useState(false);
  const [minutesSince, setMinutesSince] = useState(0);
  useEffect(() => {
    const checkStale = () => {
      const now = Date.now(); // 現在のミリ秒
      const expiresAt = timestamp * 1000 + stale_time * 1000; // 秒 → ミリ秒

      setIsStale(now > expiresAt);
      if (now > expiresAt) {
        const diffInMilliseconds = now - timestamp * 1000;
        const diffInMinutes = Math.floor(diffInMilliseconds / 1000 / 60); // 分単位に変換
        setMinutesSince(diffInMinutes);
      }
    };

    // 初回チェック
    checkStale();

    const timer = setInterval(checkStale, 1000);

    return () => clearInterval(timer);
  }, [timestamp, stale_time]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #ccc",
        flexDirection: "column",
        height: "15%",
        width: `calc(90% / ${Math.ceil(total / 5)} )`,
        padding: 0.5,
        backgroundColor: isStale ? "#f8d7da" : "#fff",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          paddingBottom: 0.5,
        }}
      >
        {icon === "camera" && <CameraAltIcon />}
        {icon === "thermo" && <DeviceThermostatIcon />}
        {icon === "storage" && <StorageIcon />}
        {icon === "battery" && <BatteryChargingFullIcon />}
        <LinearWithValueLabel value={value} unit={unit} threshold={threshold} />
      </Box>
      <Box
        sx={{
          width: "100%",
          textAlign: "center",
          borderTop: "1px solid #ccc",
          paddingTop: 0.5,
        }}
      >
        <Typography>
          {isStale ? `NO DATA SINCE ${minutesSince} min` : title}
        </Typography>
      </Box>
      <Box></Box>
    </Box>
  );
}
