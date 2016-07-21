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

function normalize(data, min, max) {
  return (data - min) / (max - min);
}

function getDataEMManga(x, y) {
  const ew = [];
  const vel = [];
  for (let z = 0; z < window.DataDepth; ++z) {
    // Reverse y so origin is in bottom left (insted of top left)
    const idx = z * window.DataWidth * window.DataHeight + (window.DataHeight - 1 - y) * window.DataWidth + x;
    vel.push(window.DataCubeVel[idx]);
    if (window.DataCubeFlux[idx] === 0) {
      ew.push(0);
    } else {
      ew.push(normalize(window.DataCubeFlux[idx], window.DataFluxMin, window.DataFluxMax));
    }
  }
  return { ew, vel };
}

function getDataStarManga(x, y) {
  // Reverse y so origin is in bottom left (insted of top left)
  const idx = (window.DataHeight - 1 - y) * window.DataWidth + x;
  const vel = window.DataCubeStar[idx];
  // normalize between 0 and 1
  let ew;
  if (window.DataCubeStarFlux[idx] === 0) {
    ew = 0;
  } else {
    // normalize between 0 and 1
    ew = normalize(window.DataCubeStarFlux[idx], window.DataStarFluxMin, window.DataStarFluxMax);
    // shift to be between 1 and 10, then take the log10
    // this will result in a number between 0 and 1 on a log scale
    ew = Math.log10((ew * 9) + 1);
  }
  return { ew, vel };
}

module.exports = {
  mouse2data,
  getDataEMManga,
  getDataStarManga,
};
