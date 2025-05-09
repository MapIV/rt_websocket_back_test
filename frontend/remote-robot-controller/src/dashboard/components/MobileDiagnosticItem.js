import { Box, Typography, Popover, ClickAwayListener } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import StorageIcon from "@mui/icons-material/Storage";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import { useEffect, useState } from "react";

export default function MobileDiagnosticItem({
  icon,
  threshold,
  title,
  stale_time,
  value,
  unit,
  total,
  timestamp,
  mode,
}) {
  const [isStale, setIsStale] = useState(false);
  const [minutesSince, setMinutesSince] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const checkStale = () => {
      const now = Date.now();
      const expiresAt = timestamp * 1000 + stale_time * 1000;

      setIsStale(now > expiresAt);
      if (now > expiresAt) {
        const diffInMilliseconds = now - timestamp * 1000;
        const diffInMinutes = Math.floor(diffInMilliseconds / 1000 / 60);
        setMinutesSince(diffInMinutes);
      }
    };

    checkStale();
    const timer = setInterval(checkStale, 1000);
    return () => clearInterval(timer);
  }, [timestamp, stale_time]);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const bgColor = isStale
    ? "#f8d7da"
    : value > threshold[2]
    ? "rgb(175, 205, 177)"
    : value > threshold[1]
    ? "rgb(248, 199, 158)"
    : "rgb(238, 175, 175)";

  const renderIcon = () => {
    switch (icon) {
      case "camera":
        return <CameraAltIcon />;
      case "thermo":
        return <DeviceThermostatIcon />;
      case "storage":
        return <StorageIcon />;
      case "battery":
        return <BatteryChargingFullIcon />;
      default:
        return null;
    }
  };
  let text = "";
  if (typeof value == "number") {
    text = `${Math.round(value)}`;
    switch (unit) {
      case "hz":
        text = `${text}Hz`;
        break;
      case "percent":
        text = `${text}%`;
        break;
      default:
        break;
    }
  } else {
    text = value;
  }
  return (
    <>
      <Box
        onClick={handleOpen}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: `calc((100% / ${total}) - 3px)`,
          border: "1px solid #ccc",
          backgroundColor: bgColor,
          opacity: 0.7,
          cursor: "pointer",
        }}
      >
        {renderIcon()}
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center", // アイコンの中央に
          horizontal: !mode ? "right" : "center", // アイコンの右側に
        }}
        transformOrigin={{
          vertical: "center", // ポップアップの中央が
          horizontal: !mode ? "left" : "center", // アイコンの右にくっつく
        }}
        sx={{
          marginTop: !mode ? "" : "6dvh",
          marginLeft:!mode?"2dvw":"0"
        }}
      >
        {/* {console.log(mode)} */}
        <ClickAwayListener onClickAway={handleClose}>
          <Box
            sx={{
              backgroundColor: isStale ? "#f8d7da" : bgColor,
              p: 1,
              width: !mode ? "200px" : "12dvw",
              height: !mode ? "40px" : "40dvh",
            }}
          >
            {isStale ? (
              !mode ? (
                <Typography>NO DATA SINCE {minutesSince} min</Typography>
              ) : (
                <Typography
                  sx={{
                    transform: "rotate(90deg)",
                    whiteSpace: "nowrap",
                  }}
                >
                  NO DATA SINCE {minutesSince} min
                </Typography>
              )
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  transform: !mode ? "" : "rotate(90deg)",
                }}
              >
                <Typography variant="subtitle1" sx={{ marginRight: "10px" }}>
                  {title}
                </Typography>
                <Typography variant="body2">{text}</Typography>
              </Box>
            )}
          </Box>
        </ClickAwayListener>
      </Popover>
    </>
  );
}
