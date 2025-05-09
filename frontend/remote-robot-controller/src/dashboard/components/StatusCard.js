import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import DiagnosticItem from "./DiagnosticItem";

export default function StatusCard({diagnosticsData}) {
 
  return (
    <Box sx={{ minWidth: 275}}>
      <Card variant="outlined">
        <React.Fragment >
          <CardContent >
            <Typography gutterBottom sx={{ fontSize: 28 }}>
              Status
            </Typography>
          </CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
              flexDirection: "column",
              maxHeight: 350,
              paddingBottom: 2,
            }}
          >
            {!!diagnosticsData &&
              diagnosticsData["names"]?.map((data, index,ary) => {
                  return (<DiagnosticItem icon={data.icon}  value={data.value} unit={data.unit} title={data.name} threshold={data.threshold} stale_time={data.stale_time} total={ary.length} timestamp={diagnosticsData.timestamp.raw} key={index} />);
        
              })}
          </Box>
        </React.Fragment>
      </Card>
    </Box>
  );
}
