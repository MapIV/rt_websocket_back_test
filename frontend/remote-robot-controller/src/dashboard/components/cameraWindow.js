import { useEffect } from "react"
import { initWebsocket } from "../api/websocket"
import { Box } from "@mui/system"

export default function CameraWindow({CardHeight}){
    useEffect(()=>{
        initWebsocket("camera","dammy")
    },[])
    return(
        <Box
            component="img"
            id="camera_feed"
            alt="cameraImg"
            sx={{
                width: "90%",
                height: {
                    xs:"100%",
                    sm: 400,  // タブレットサイズ（sm: 600px以上）
                    md: CardHeight,  // PCサイズ（md: 900px以上）
                },
                display: "block",
                objectFit: "contain",
            }}
        />

    )
}
