import React, { useState } from "react";
import {
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

export default function ModeChangeSwitch({ checked, modeSwitch }) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true); // ダイアログを表示
  };

  const handleConfirm = () => {
    modeSwitch(!checked);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Box
        sx={(theme) => ({
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 62,
          height: 34,
          backgroundColor: checked
            ? theme.palette.warning.main
            : theme.palette.primary.main,
          borderRadius: "17px",
          padding: "4px",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
          position: "relative",
          
        })}
        onClick={handleClick}
      >
        <Box
          sx={{
            position: "absolute",
            left: checked ? "28px" : "4px",
            transition: "left 0.3s ease",
          }}
        >
          <IconButton
            size="small"
            sx={{
              color: "white",
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            {checked ? <SportsEsportsIcon /> : <SmartToyIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* ダイアログ */}
      <Dialog open={open} onClose={handleCancel} sx={{
          transform: checked ?"rotate(90deg)":"",
          width: checked? "100vh":"100vw",
          height: checked? "100vw":"100vh",
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          top:"50%",
          left:"50%",
          position:"absolute",
          translate:"-50% -50%"
        
      }}>
        <DialogTitle>モード切替の確認</DialogTitle>
        <DialogContent>
          <DialogContentText>
            本当にモードを
            <Box
              sx={(theme) => ({
                color: checked
                  ? theme.palette.primary.main
                  : theme.palette.warning.main,
              })}
            >
              {checked ? "AUTO" : "MANUAL"}
            </Box>
            に切り替えますか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="inherit">
            キャンセル
          </Button>
          <Button
            onClick={handleConfirm}
            color={checked ? "primary" : "warning"}
            autoFocus
          >
            切り替える
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
