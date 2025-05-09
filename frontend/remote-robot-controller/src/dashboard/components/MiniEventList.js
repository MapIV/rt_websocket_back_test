import React, { useEffect, useState } from "react"; // useState をインポート
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal"; // Modal をインポート
import Typography from "@mui/material/Typography"; // Typography をインポート (モーダル内表示用)
import Button from "@mui/material/Button"; // Button をインポート (閉じるボタン用)
import { DataGrid } from "@mui/x-data-grid";
import { Card, CardContent, Table, TableCell, TableRow } from "@mui/material";
import {
  initWebsocket,
  registerEventsCallback,
  registerVideoUrlCallback,
} from "../api/websocket";
import MapCard from "./MapCard";
import ThermalVideoCard from "./ThermalVideoCard";

const columns = [
  { field: "id", headerName: "ID", width: 105 },
  { field: "date", headerName: "Date", width: 130, editable: true },
  { field: "time", headerName: "Time", width: 130, editable: true },
  { field: "event", headerName: "Event", width: 150, editable: true },
  { field: "location", headerName: "Location", sortable: false, width: 160 },
];

const mediaQuery = window.matchMedia("(max-width: 768px)");
const isMobile = mediaQuery.matches;

const boxStyle = {
  width: { xs: "45%", md: "80%", lg: "48%" },
  height: { xs: "45%", lg: "48%" },
};
export default function MiniEventList() {
  const [open, setOpen] = useState(false); // モーダルの開閉状態
  const [selectedRow, setSelectedRow] = useState(null); // 選択された行データ
  const [videoUrl, setVideoUrl] = useState(null);
  const [rows, setRows] = useState([]); // 行データを格納するstate
  useEffect(() => {
    registerVideoUrlCallback(setVideoUrl);
    initWebsocket("video", 0);
    registerEventsCallback(setRows);
    initWebsocket("events", 50);
  }, []);

  // 行クリック時のハンドラ
  const handleRowClick = (params) => {
    // params.row にクリックされた行のデータが入っています
    setSelectedRow(params.row); // 選択された行データをstateに保存
    setOpen(true); // モーダルを開く
  };

  // モーダルを閉じるハンドラ
  const handleClose = () => {
    setOpen(false); // モーダルを閉じる
    setSelectedRow(null); // 選択された行データをリセット (任意)
  };
  return (
    <>
      {/* DataGridとModalを並列に置くためにフラグメントを使用 */}
      <Box sx={{ height: "100%", width: "100%" }}>
        <DataGrid
          onRowClick={handleRowClick}
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
          disableRowSelectionOnClick // これがあると行選択自体は無効になるため、クリックイベントは拾えます
        />
      </Box>
      {/* モーダルコンポーネント */}
      <Modal
        open={open} // open stateで開閉を制御
        onClose={handleClose} // モーダル外クリックやEscキーで閉じる
        aria-labelledby="event-detail-modal-title"
        aria-describedby="event-detail-modal-description"
      >
        <Box
          sx={{
            position: "relative",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "90vw" : "50vw", // モーダルの幅を調整
            height: isMobile ? "70vh" : "80vh",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,

            p: 1, // padding
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              flexWrap: "wrap",
              width: "100%",
              height: "90%",
            }}
          >
            <Box sx={boxStyle}>
              <Card sx={{ width: "100%", height: "100%" }}>
             

                <CardContent
                  sx={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    id="event-detail-modal-title"
                    textAlign="center"
                    borderBottom="1px solid black"
                    fontSize={{xs:"1rem",lg:"2rem"}}
                    pb={1}
                    sx={{ width: "100%" ,height: "10%" }}
                  >
                    イベント詳細
                  </Typography>
                  {selectedRow && (
                    <Table size="small" sx={{ width: "100%" ,height: "85%"}}>
                      {Object.entries(selectedRow).map(([key, value]) => {
                        return (
                          <TableRow>
                            <TableCell variant="head">{key}</TableCell>
                            <TableCell>{value}</TableCell>
                          </TableRow>
                        );
                      })}
                    </Table>
                  )}
                </CardContent>
              </Card>
            </Box>
            <Box sx={boxStyle}>
              <Box sx={{ height: "100%", width: "100%" }}>
                <MapCard />
              </Box>
            </Box>
            <Box
              sx={{
                ...boxStyle,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ThermalVideoCard />
            </Box>
            <Box
              sx={{
                ...boxStyle,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ThermalVideoCard />
            </Box>
          </Box>

          <Button
            onClick={handleClose}
            sx={{
              width: "30%",
              height: "5%",
              position: "absolute",
              bottom: 0,
              left: "50%",
              translate: "-50% 0",
              border: "1px solid",
              mb: 2,
            }}
          >
            閉じる
          </Button>
        </Box>
      </Modal>
    </>
  );
}
