import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
// import type { LatLngTuple } from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'



const mediaQuery = window.matchMedia("(max-width: 768px)");
const Smartphone = mediaQuery.matches;
const CardHeight = Smartphone ? 230 : 500;
const MapHeight = Smartphone ? 200 : 470;


const position/*: LatLngTuple*/ = [51.505, -0.09,]

export default function MapCard() {
	return (
		<Card sx={{ height: CardHeight, minWidth: 275 }}>
			<CardContent>
		

        <Box sx={{height: MapHeight}}>

        <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{height:'100%', width: '100%'}}>
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
