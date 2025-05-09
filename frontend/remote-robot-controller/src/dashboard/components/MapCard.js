import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";


const position /*: LatLngTuple*/ = [51.505, -0.09];

export default function MapCard() {
  return (
    <Card sx={{ height: "100%", width: "100%" }}>
      <CardContent sx={{height:"100%", width:"100%"}}>
        <Box sx={{ height: "95%",maxHeight:"95%" }}>
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                A pretty CSS3 popup. <br />
              </Popup>
            </Marker>
          </MapContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
