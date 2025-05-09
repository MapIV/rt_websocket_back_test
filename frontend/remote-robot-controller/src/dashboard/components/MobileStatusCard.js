import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import MobileDiagnosticItem from "./MobileDiagnosticItem";

export default function MobileStatusCard({ diagnosticsData,mode }) {
  return (
    <Box
      sx={{
        height: 280,
        width: "10vw",
        minWidth: 40,
        marginTop: 0,
        position: "relative",
      }}
    >
      <Card
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {!!diagnosticsData &&
          diagnosticsData["names"]?.map((data, index, ary) => {
            return (
              <MobileDiagnosticItem
                icon={data.icon}
                value={data.value}
                unit={data.unit}
                title={data.name}
                threshold={data.threshold}
                stale_time={data.stale_time}
                total={ary.length}
                timestamp={diagnosticsData.timestamp.raw}
                key={index}
                mode={mode}
              />
            );
          })}
      </Card>
    </Box>
  );
}
