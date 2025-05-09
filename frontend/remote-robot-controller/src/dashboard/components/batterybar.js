import * as React from "react";
import PropTypes from "prop-types";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function LinearProgressWithLabel(props) {
	//検討中
	let text
	
	if(typeof props.value == "number") {
		text = `${Math.round(props.value)}`
		switch (props.unit) {
			case "hz":
				text=`${text}Hz`
				break;
			case "percent":
				text=`${text}%`
				break
			default:
				break;
		}

	}
	else{
		text=props.value
	}
	return (
		<Box sx={{ display: "flex", alignItems: "center" }}>
			<Box sx={{ width: "100%", mr: 1,ml:1 }}>
				<LinearProgress variant="determinate" {...props} color={props.value>props.threshold[2] ? "success" : props.value>props.threshold[1] ? "warning" : "error"}/>
			</Box>
			<Box sx={{ minWidth: 35,mr:"auto" }}>
				<Typography variant="body2" sx={{ color: "text.secondary" }}>
					{text}
				</Typography>
			</Box>
		</Box>
	);
}


LinearProgressWithLabel.propTypes = {
	/**
	 * The value of the progress indicator for the determinate and buffer variants.
	 * Value between 0 and 100.
	 */
	value: PropTypes.number.isRequired,
};

export default function LinearWithValueLabel({value,unit,threshold}) {


	return (
		<Box sx={{ width: "100%" }}>
			<LinearProgressWithLabel value={value} unit={unit} threshold={threshold}/>
		</Box>
	);
}
