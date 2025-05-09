import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { Joystick } from "react-joystick-component";

export default function JoyStickWindow() {
	const [gamepadIndex, setGamepadIndex] = useState(null);
	const [stickPos, setStickPos] = useState({ x: 0, y: 0 });
	const [inputSource, setInputSource] = useState("joystick");

	const animationFrameId = useRef(null);

	useEffect(() => {
		const handleGamepadConnected = (e) => {
			console.log("Gamepad connected:", e.gamepad);
			setGamepadIndex(e.gamepad.index);
		};

		const handleGamepadDisconnected = (e) => {
			console.log("Gamepad disconnected:", e.gamepad);
			if (gamepadIndex === e.gamepad.index) {
				setGamepadIndex(null);
			}
		};
		window.addEventListener("gamepadconnected", handleGamepadConnected);
		window.addEventListener("gamepaddisconnected", handleGamepadDisconnected);

		return () => {
			window.removeEventListener("gamepadconnected", handleGamepadConnected);
			window.removeEventListener("gamepaddisconnected", handleGamepadDisconnected);
		};
	}, [gamepadIndex]);

	useEffect(() => {

		const pollGamepad = () => {
			const gamepads = navigator.getGamepads();
			const gp = gamepadIndex !== null ? gamepads[gamepadIndex] : null;

			if (gp) {
				
				const x = gp.axes[0];
				const y = -gp.axes[1];
				if(inputSource !== "joystick"){
					setStickPos({ x: x.toFixed(2), y: y.toFixed(2) });
				}
			}

			animationFrameId.current  = requestAnimationFrame(pollGamepad);
		};

		if (gamepadIndex !== null) {
			
			animationFrameId.current = requestAnimationFrame(pollGamepad);
		}

		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	}, [gamepadIndex,inputSource]);
	useEffect(() => {
		console.log("Joystick position:", stickPos);
		
	}, [stickPos]);
	const handleMove = (e) => {
		setInputSource("joystick");
		setStickPos({ x: e.x, y: e.y}); // normalize to -1~1
	};

	const handleStop = () => {
		setInputSource("gamepad");
		setStickPos({ x: 0, y: 0 });
	};
	return (
		<Box sx={{ mt: 5 }}>
			<Joystick
				size={100}
				sticky={false}
				baseColor={"rgba(0, 0, 0, 0.4)"}
				stickColor={"#FFFBF6"}
				move={handleMove}
				stop={handleStop}
				pos={{ x: stickPos.x, y: stickPos.y}}
			/>
		</Box>
	);
}
