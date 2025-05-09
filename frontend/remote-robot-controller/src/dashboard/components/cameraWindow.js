import { useEffect } from "react"
import { initWebsocket } from "../api/websocket"
import { Box } from "@mui/system"

export default function CameraWindow(){
    useEffect(()=>{
        initWebsocket("camera",0)
    },[])
    return(
        <Box
            component="img"
            id="camera_feed"
            alt="cameraImg"
            sx={{
                width: "90%",
                height:"90%",
            
                display: "block",
                objectFit: "contain",
            }}
        />

    )
}
