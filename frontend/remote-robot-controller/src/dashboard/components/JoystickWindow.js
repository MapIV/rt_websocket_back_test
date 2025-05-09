import React, { useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { Joystick } from "react-joystick-component";
import { initWebsocket, sendJoystickData } from "../api/websocket";

const mediaQuery = window.matchMedia("(max-width: 768px)");
const Smartphone = mediaQuery.matches;

export default function JoyStickWindow({ isManual }) {
	const isManualRef = useRef(isManual);
	useEffect(() => {
		isManualRef.current = isManual;
	}, [isManual]);

	const [gamepadIndex, setGamepadIndex] = useState(null);
	const [stickPos, setStickPos] = useState({ x: 0, y: 0 });
	const [inputSource, setInputSource] = useState("joystick");

	const animationFrameId = useRef(null);

	// WebSocket初期化（初回のみ）
	useEffect(() => {
		initWebsocket("joystick", 0);
	}, []);

	// Gamepad接続/切断イベント処理
	useEffect(() => {
		const handleGamepadConnected = (e) => {
			console.log("Gamepad connected:", e.gamepad);
			setGamepadIndex(e.gamepad.index);
			setInputSource("gamepad");

		};

		const handleGamepadDisconnected = (e) => {
			console.log("Gamepad disconnected:", e.gamepad);
			setInputSource("joystick");
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

	// 入力処理関数（最新の isManual を参照）
	const processJoystickInput = useCallback((x, y) => {
		if (!isManualRef.current) return;

		const linearX = Math.sqrt(x * x + y * y);
		const angularZ = Math.atan2(y, x);
		const timestamp = Date.now() / 1000;

		sendJoystickData({
			linear: { x: linearX, y: 0.0, z: 0.0 },
			angular: { x: 0.0, y: 0.0, z: angularZ },
			timestamp,
		});
	}, []);

	// Gamepad入力監視（inputSource 依存を削除）
	useEffect(() => {
		const pollGamepad = () => {
			const gamepads = navigator.getGamepads();
			const gp = gamepadIndex !== null ? gamepads[gamepadIndex] : null;

			if (gp) {
				const x = gp.axes[0];
				const y = -gp.axes[1];

				if (Math.abs(x) >= 0.05 || Math.abs(y) >= 0.05) {
				
					processJoystickInput(x, y);
				}

				if (inputSource !== "joystick") {
					setStickPos({ x: x.toFixed(2), y: y.toFixed(2) });
				}
			}

			animationFrameId.current = requestAnimationFrame(pollGamepad);
		};

		if (gamepadIndex !== null) {
			animationFrameId.current = requestAnimationFrame(pollGamepad);
		}

		return () => {
			cancelAnimationFrame(animationFrameId.current);
		};
	}, [gamepadIndex]); // ← inputSource を依存から削除

	// ジョイスティック操作時
	const handleMove = useCallback(
		(e) => {
			
			if (inputSource === "gamepad") return;

			if (isManualRef.current && Smartphone) {
				// 横向きスマホ用補正
				setStickPos({ x: -e.y, y: e.x });
				processJoystickInput(-e.y, e.x);
				console.log("90deg");
			} else {
				setStickPos({ x: e.x, y: e.y });
				processJoystickInput(e.x, e.y);
			}
		},
		[inputSource] // これはOK
	);

	// ジョイスティック離した時
	const handleStop = () => {
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
				pos={{ x: stickPos.x, y: stickPos.y }}
			/>
		</Box>
	);
}
