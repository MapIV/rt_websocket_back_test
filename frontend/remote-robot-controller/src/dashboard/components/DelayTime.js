import { Box, Typography } from "@mui/material";

export default function DelayTime({ delayTime }) {
  return (
    <Box
      sx={{
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "4px 8px",
        display: "inline-block",
        minWidth: "100px",
        textAlign: "center",
        marginRight:"1vh"
      }}
    >
      <Typography variant="body2">
        Delay Time: {delayTime} ms
      </Typography>
    </Box>
  );
}
