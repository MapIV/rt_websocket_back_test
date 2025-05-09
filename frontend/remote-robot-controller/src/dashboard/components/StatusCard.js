import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import DiagnosticItem from "./DiagnosticItem";

export default function StatusCard({ diagnosticsData }) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* <CardContent height="100%">
            <Typography gutterBottom sx={{ fontSize: "1rem" }}>
              Status
            </Typography>
          </CardContent> */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
          flexWrap: "wrap",
          gap: 2,
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding:"2% 0",
        }}
      >
        {!!diagnosticsData &&
          diagnosticsData["names"]?.map((data, index, ary) => {
            return (
              <DiagnosticItem
                icon={data.icon}
                value={data.value}
                unit={data.unit}
                title={data.name}
                threshold={data.threshold}
                stale_time={data.stale_time}
                total={ary.length}
                timestamp={diagnosticsData.timestamp.raw}
                key={index}
              />
            );
          })}
      </Box>
    </Card>
  );
}
