import { Box, Typography } from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // 時間を示すアイコンを追加
import { useTheme } from '@mui/material/styles';

export default function DelayTime({ delayTime }) {
  const theme = useTheme();

  // 背景色とそれに対応するテキスト/アイコンの色を定義
  const backgroundColor = theme.palette.info.light; // 薄いブルー系の背景色
  // theme.palette.info.contrastText は theme.palette.info.light に対する適切な文字色を返す
  const textColor = theme.palette.getContrastText(backgroundColor); // 背景色に対するコントラストカラーを取得

  return (
    <Box
      sx={{
        // --- サイズ指定 ---
        width: "40vw", // 元のボタンの幅に合わせる
        height: "100%", // 親要素の高さに合わせる (重要: 親要素で高さ指定が必要)

        // --- スタイル指定 ---
        backgroundColor: backgroundColor, // 遅延時間に適した背景色（薄いブルー系）
        color: textColor, // 背景色に合わせた文字色
        borderRadius: "4px",
        display: "flex", // flex または inline-flex
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "5px 8px",
        boxSizing: 'border-box',
        gap: '6px', // アイコンとテキストの間隔を少し広げる
      }}
    >
      {/* 時間を表すアイコンを追加し、色を文字色に合わせる */}
      <AccessTimeIcon sx={{ fontSize: 18, color: textColor }} />

      {/* 文字色を親Boxから継承 or 直接指定 */}
      <Typography variant="body2" sx={{ color: "inherit"}}>
         {delayTime} ms
      </Typography>
    </Box>
  );
}
