import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export default function EmergencyStop() {
  return (
    <Box sx={{ "& button": { m:{ lg:1} } }}>
      <Button
        sx={{
          width: {
            xs: "100vw",
            lg: "20vw",
          },
          height: {
            xs: "7vh",
            lg: "6vh",
          },
          fontSize: {
            xs: "2rem",
            lg: "2rem",
          },
		  padding:{
			xs: 2,
			lg:0,
		  },
		  borderRadius:{
			xs: 0,
			lg:1,
		  },
          backgroundColor: "rgb(255, 80, 80)",
          color: "white",
          '&:hover': {
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
  );
}
