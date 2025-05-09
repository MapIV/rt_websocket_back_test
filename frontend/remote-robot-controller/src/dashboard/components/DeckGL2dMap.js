import React, { useMemo } from 'react';
import PropTypes from 'prop-types'; // prop-types をインポート (型チェック用)
import { DeckGL } from '@deck.gl/react';
import Map from 'react-map-gl/maplibre'; // ✅ OK

import maplibregl from 'maplibre-gl'; // デフォルトでMapLibreを使用
import 'maplibre-gl/dist/maplibre-gl.css';

// デフォルトの初期ビュー設定 (名古屋駅中心)
const DEFAULT_INITIAL_VIEW_STATE = {
  longitude: 136.9064,
  latitude: 35.1815,
  zoom: 12,
  // pitch と bearing は 0 に固定
};

// デフォルトの地図スタイル (MapLibre Demo Tiles)
const DEFAULT_MAP_STYLE = 'https://demotiles.maplibre.org/style.json';

/**
 * deck.gl を使用して 2D マップを表示するコンポーネント
 */
function DeckGL2DMap({
  initialViewState: customViewState, // 外部から中心座標やズームを指定
  layers = [],                       // 表示するdeck.glレイヤーの配列
  mapStyle = DEFAULT_MAP_STYLE,      // 背景地図のスタイルURL
  style = { position: 'relative', width: '100%', height: '500px' }, // コンポーネントのスタイル
  controller = true,                 // 地図操作を有効にするか
  disableRotation = true,            // 回転・傾け操作を無効にするか (2D維持のためデフォルトtrue)
  mapLib = maplibregl,               // 使用する地図ライブラリ (Mapbox GL JSも指定可能)
  mapboxAccessToken,                 // Mapbox使用時のアクセストークン
  ...deckGLProps                     // その他のDeckGLコンポーネントに渡すプロパティ
}) {

  // initialViewState を構築 (pitch と bearing は常に 0)
  const initialViewState = useMemo(() => ({
    ...DEFAULT_INITIAL_VIEW_STATE, // デフォルト値を設定
    ...customViewState,            // 外部からの指定で上書き
    pitch: 0,                      // 常に 0 (2Dビュー)
    bearing: 0                     // 常に 0 (北が上)
  }), [customViewState]);

  // Mapコンポーネントに渡すプロパティ (回転無効化など)
  const mapProps = useMemo(() => ({
    mapStyle,
    mapboxAccessToken,
    dragRotate: !disableRotation, // disableRotationがtrueならfalse (回転無効)
    touchRotate: !disableRotation,
    pitchWithRotate: !disableRotation,
  }), [mapStyle, mapboxAccessToken, disableRotation]);

  return (
    <DeckGL
      initialViewState={initialViewState}
      controller={controller}
      layers={layers}
      style={style}
      mapLib={mapLib} // 地図ライブラリのインスタンスを渡す
      {...deckGLProps} // 残りのプロパティを展開
    >
      <Map {...mapProps} /> {/* Mapコンポーネントにプロパティを渡す */}
    </DeckGL>
  );
}

// --- Prop Types 定義 ---
DeckGL2DMap.propTypes = {
  /** 表示する初期のビュー状態 (longitude, latitude, zoom) */
  initialViewState: PropTypes.shape({
    longitude: PropTypes.number,
    latitude: PropTypes.number,
    zoom: PropTypes.number,
  }),
  /** 表示する deck.gl レイヤーの配列 */
  layers: PropTypes.array,
  /** 背景地図のスタイルURLまたはスタイルオブジェクト */
  mapStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /** コンポーネントのコンテナに適用するCSSスタイル */
  style: PropTypes.object,
  /** 地図操作 (パン、ズームなど) を有効にするか */
  controller: PropTypes.bool,
  /** 回転・傾け操作を無効にするか (trueで無効) */
  disableRotation: PropTypes.bool,
  /** 使用する地図ライブラリのインスタンス (maplibregl または mapboxgl) */
  mapLib: PropTypes.object,
  /** Mapboxのアクセストークン (Mapboxスタイル使用時に必要) */
  mapboxAccessToken: PropTypes.string,
};

export default DeckGL2DMap;

// --- 使用例 ---
/*
import React from 'react';
import DeckGL2DMap from './DeckGL2DMap'; // 上記コンポーネントをインポート
import { ScatterplotLayer } from '@deck.gl/layers';

function MyApp() {
  // 表示するデータ
  const data = [
    { position: [136.9064, 35.1815], name: '名古屋駅' },
    { position: [136.9773, 35.1707], name: '栄' },
  ];

  // 表示するレイヤー
  const mapLayers = [
    new ScatterplotLayer({
      id: 'locations',
      data,
      getPosition: d => d.position,
      getFillColor: [255, 0, 0], // 赤色
      getRadius: 5,
      radiusUnits: 'pixels' // ピクセル単位
    })
  ];

  // カスタム初期ビュー (例: 栄を中心に表示)
  const customView = {
    longitude: 136.9088, // 栄駅あたり
    latitude: 35.1710,
    zoom: 14
  };

  return (
    <div>
      <h1>My 2D Map</h1>
      <DeckGL2DMap
        initialViewState={customView}
        layers={mapLayers}
        // mapStyle="mapbox://styles/mapbox/streets-v11" // Mapboxスタイルを使う場合
        // mapboxAccessToken="YOUR_MAPBOX_ACCESS_TOKEN" // Mapboxトークン
        style={{ height: '600px', width: '80%', margin: 'auto' }} // スタイルをカスタマイズ
      />
    </div>
  );
}
*/