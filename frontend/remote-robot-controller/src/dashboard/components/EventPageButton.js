import * as React from "react";
import { useState } from "react"; // useState をインポート
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal"; // Modal をインポート
import Typography from "@mui/material/Typography"; // Typography をインポート
import { DataGrid } from "@mui/x-data-grid"; // DataGrid をインポート
// import { useNavigate } from "react-router-dom"; // 不要になるのでコメントアウトまたは削除

// --- イベントデータ定義 (MiniEventListと同じもの) ---
// 本来はコンポーネント間で共有するデータですが、ここでは例として直接定義します
const columns = [
    { field: "id", headerName: "ID", width: 90 }, // モーダル内なので少し幅を調整
    { field: "date", headerName: "Date", width: 105 },
    { field: "time", headerName: "Time", width: 105 },
    { field: "event", headerName: "Event", width: 130 },
    { field: "location", headerName: "Location", sortable: false, width: 130 },
];

const rows = [
    { id: 1, date: "2/18", time: "12:00", event: "Battery", location: "栄" },
    { id: 2, date: "2/18", time: "11:30", event: "Arrival", location: "伏見" },
    { id: 3, date: "2/18", time: "11:00", event: "Manual Mode", location: "名古屋" },
    { id: 4, date: "2/18", time: "10:30", event: "Storage", location: "池下" },
    { id: 5, date: "2/18", time: "10:00", event: "Route", location: "今池" },
    // 必要であればもっと多くの行を追加
];

// モーダルのスタイル定義 (画面中央に表示、DataGridを表示するため少し大きめに)
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%', // 画面幅に応じて調整 (例: 600)
    maxWidth: 700, // 最大幅を設定
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 2,
    display: 'flex', // Flexbox を使用して内部要素を配置
    flexDirection: 'column', // 縦方向に並べる
    maxHeight: '80vh', // モーダルの最大高さを制限
};

const dataGridContainerStyle = {
    height: 300, // DataGridの表示高さを固定 (調整可能)
    width: "100%",
    overflow: 'auto', // 内容が多い場合にスクロール可能にする
    mt: 2, // 上部のタイトルとの間にマージン
};


const EventPageButton = () => {
    // const navigate = useNavigate(); // 不要
    const [open, setOpen] = useState(false); // モーダルの開閉状態

    // モーダルを開くハンドラ
    const handleOpen = () => {
        setOpen(true);
    };

    // モーダルを閉じるハンドラ
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <> {/* ボタンとモーダルを並列に配置 */}
            {/* イベント表示ボタン */}
            <Box>
                <Button variant="outlined" onClick={handleOpen} size="small"> {/* onClickをhandleOpenに変更 */}
                    Event List {/* ボタンのテキストを分かりやすく変更 (任意) */}
                </Button>
            </Box>

            {/* イベント一覧表示モーダル */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="event-list-modal-title"
                aria-describedby="event-list-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="event-list-modal-title" variant="h6" component="h2">
                        イベント一覧
                    </Typography>
                    {/* DataGridをモーダル内に表示 */}
                    <Box sx={dataGridContainerStyle}>
                        <DataGrid
                            rows={rows} // すべての行データを渡す
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 5, // 1ページあたりの行数
                                    },
                                },
                                // 必要であればソートなども初期設定可能
                                // sorting: { sortModel: [{ field: 'id', sort: 'desc' }] }
                            }}
                            pageSizeOptions={[5, 10, 20]} // ページサイズの選択肢
                            checkboxSelection={false} // チェックボックスは不要ならfalse
                            disableRowSelectionOnClick // 行クリックでの選択を無効化
                            density="compact" // もしスペースを節約したい場合
                        />
                    </Box>
                    <Button onClick={handleClose} sx={{ mt: 2, alignSelf: 'flex-end' }}> {/* 閉じるボタンを右下に配置 */}
                        閉じる
                    </Button>
                </Box>
            </Modal>
        </>
    );
}

export default EventPageButton;