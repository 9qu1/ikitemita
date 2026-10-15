// 箱庭ごとの、生きものが歩ける（泳げる）範囲 [中心x, 中心y, 横の半径, 縦の半径]（絵の幅・高さを1とした割合）
//   walk は歩く・はう生きもの、swim は泳ぐ・浮かぶ生きもの（なければ walk）。tools/hab-check.mjs で絵に重ねて確かめる
export const HAB_AREA = {
  default: { walk: [0.5, 0.55, 0.16, 0.08] },
  forest: { walk: [0.5, 0.54, 0.19, 0.09] },
  garden: { walk: [0.5, 0.54, 0.19, 0.09] },
  home: { walk: [0.5, 0.6, 0.17, 0.075] },
  ice: { walk: [0.5, 0.5, 0.22, 0.08], swim: [0.5, 0.75, 0.25, 0.05] },
  jungle: { walk: [0.5, 0.56, 0.16, 0.08] },
  ocean: { walk: [0.47, 0.52, 0.2, 0.15] },
  reef: { walk: [0.5, 0.5, 0.21, 0.1] },
  river: { walk: [0.42, 0.61, 0.15, 0.06], swim: [0.56, 0.46, 0.13, 0.055] },
  savanna: { walk: [0.5, 0.56, 0.2, 0.1] },
  seashore: { walk: [0.37, 0.5, 0.12, 0.08], swim: [0.69, 0.56, 0.12, 0.07] },
  town: { walk: [0.5, 0.56, 0.17, 0.08] },
  underground: { walk: [0.5, 0.58, 0.13, 0.055] },
  village: { walk: [0.5, 0.53, 0.13, 0.08] },
};

const WATER = new Set(['swim', 'float']);
export function areaFor(hab, move) {
  const h = HAB_AREA[hab] || HAB_AREA.default;
  return (WATER.has(move) && h.swim) || h.walk;
}
