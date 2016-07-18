function mouse2data(mcoo, map = 'gas') {
  const dcoo = {};
  let rect;
  switch (map) {
    case 'gas':
      rect = window.GasCnv.getBoundingClientRect();
      break;
    case 'star':
      rect = window.StarCnv.getBoundingClientRect();
      break;
    default:
      rect = window.StarCnv.getBoundingClientRect();
  }
  dcoo.x = Math.floor((mcoo.x - rect.left - window.ImgOffX) * (window.DataWidth / window.GasWidth));
  dcoo.y = Math.floor((mcoo.y - rect.top - window.ImgOffY) * (window.DataHeight / window.GasHeight));
  return dcoo;
}

function getDataEMManga(x, y) {
  const ew = [];
  const vel = [];
  for (let z = 0; z < window.DataDepth; ++z) {
    // Reverse y so origin is in bottom left (insted of top left)
    const idx = z * window.DataWidth * window.DataHeight + (window.DataHeight - 1 - y) * window.DataWidth + x;
    vel.push(window.DataCubeVel[idx]);
    ew.push(Math.max(window.DataCubeEW[idx] / window.DataEWMax, 0));
  }
  return { ew, vel };
}

function getDataStarManga(x, y) {
  // Reverse y so origin is in bottom left (insted of top left)
  const idx = (window.DataHeight - 1 - y) * window.DataWidth + x;
  return window.DataCubeStar[idx];
}

module.exports = {
  mouse2data,
  getDataEMManga,
  getDataStarManga,
};
