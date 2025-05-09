import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";


const columns = [
	{ field: "id", headerName: "ID", width: 105 },
	{
		field: "date",
		headerName: "Date",
		width: 130,
		editable: true,
	},
	{
		field: "time",
		headerName: "Time",
		width: 130,
		editable: true,
	},
	{
		field: "event",
		headerName: "Event",
		width: 150,
		editable: true,
	},
	{
		field: "location",
		headerName: "Location",
		sortable: false,
		width: 160,
	},
  {
		field: "image",
		headerName: "Image",
		sortable: false,
		width: 200,
	},
  {
		field: "thermalimage",
		headerName: "Thermal Image",
		sortable: false,
		width: 200,
	},
  {
		field: "status",
		headerName: "Status",
		sortable: false,
		width: 200,
	},

];

const rows = [
	{ id: 1, date: "2/18", time: "12:00", event: "Battery", location: "栄" },
	{ id: 2, date: "2/18", time: "11:30", event: "Arrival", location: "伏見" },
	{
		id: 3,
		date: "2/18",
		time: "11:00",
		event: "Manual Mode",
		location: "名古屋",
	},
	{ id: 4, date: "2/18", time: "10:30", event: "Storage", location: "池下" },
	{ id: 5, date: "2/18", time: "10:00", event: "Route", location: "今池" },
];


export default function EventDataList() {
	return (
		<Box sx={{ height: 900, width: "100%" }}>
			<DataGrid
				rows={rows}
				columns={columns}
				initialState={{
					pagination: {
						paginationModel: {
							pageSize: 5,
						},
					},
				}}
				pageSizeOptions={[5]}
				disableRowSelectionOnClick
			/>
		</Box>
	);
}
