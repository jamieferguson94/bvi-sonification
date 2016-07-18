const d3 = require('d3');
const linkCanvases = require('./link_canvases');
const initAudio = require('./init_audio');
const { GasListeners, StarListeners } = require('./create_listeners');
const { blueToRed } = require('./colorbar');
// const mainLeap = require('./leap_position');

window.DataReady = false;

const fitsFile = new window.astro.FITS(`${__dirname}/../data/manga-8140-12703-LOGCUBE_MAPS-NONE-023_float32.fits`, (dataInput) => {
  const hdu4 = dataInput.getHDU(4).data; // gas velocity
  const hdu6 = dataInput.getHDU(6).data; // data mask
  const hdu11 = dataInput.getHDU(11).data; // gas EW
  const hdu13 = dataInput.getHDU(13).data; // data mask
  const hdu17 = dataInput.getHDU(17).data; // star velocity
  const hdu19 = dataInput.getHDU(19).data; // star mask
  /* eslint no-underscore-dangle: 0 */
  const DataCubeVelRaw = hdu4._getFrame(hdu4.buffer, hdu4.bitpix, hdu4.bzero, hdu4.bscale);
  const DataMaskVel = hdu6._getFrame(hdu6.buffer, hdu6.bitpix, hdu6.bzero, hdu6.bscale);
  window.DataCubeVel = DataCubeVelRaw.slice();
  const DataCubeEWRaw = hdu11._getFrame(hdu11.buffer, hdu11.bitpix, hdu11.bzero, hdu11.bscale);
  const DataMaskEW = hdu13._getFrame(hdu13.buffer, hdu13.bitpix, hdu13.bzero, hdu13.bscale);
  window.DataCubeEW = DataCubeEWRaw.slice();
  for (let i = 0; i < DataCubeVelRaw.length; ++i) {
    // mask value of 0 = good data
    window.DataCubeVel[i] = window.DataCubeVel[i] * (!DataMaskVel[i]);
    window.DataCubeEW[i] = window.DataCubeEW[i] * (!DataMaskEW[i]);
  }
  const DataCubeStarRaw = hdu17._getFrame(hdu17.buffer, hdu17.bitpix, hdu17.bzero, hdu17.bscale);
  const DataMaskStar = hdu19._getFrame(hdu19.buffer, hdu19.bitpix, hdu19.bzero, hdu19.bscale);
  window.DataCubeStar = DataCubeStarRaw.slice();
  for (let i = 0; i < DataCubeStarRaw.length; ++i) {
    if (DataMaskStar[i]) {
      window.DataCubeStar[i] = null;
    }
  }
  window.DataReady = true;
  window.DataWidth = hdu4.width;
  window.DataHeight = hdu4.height;
  window.DataDepth = hdu4.depth;
  const xmag = 5;
  const ymag = 5;

  let tmpCopy = window.DataCubeVel.slice();
  tmpCopy.sort();
  window.DataVelMin = tmpCopy[0];
  window.DataVelMax = tmpCopy[tmpCopy.length - 1];

  tmpCopy = window.DataCubeEW.slice();
  tmpCopy.sort();
  window.DataEWMin = tmpCopy[0];
  window.DataEWMax = tmpCopy[tmpCopy.length - 1];

  tmpCopy = window.DataCubeStar.slice();
  tmpCopy.sort();
  window.DataStarMin = tmpCopy[0];
  window.DataStarMax = tmpCopy[tmpCopy.length - 1];

  const width = xmag * window.DataWidth;
  const height = ymag * window.DataHeight;
  const gasCanvas = d3.select('#GasCanvas')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'canvas');

  const gasCtx = gasCanvas.node().getContext('2d');

  // const velRange = Math.max(Math.abs(window.DataVelMin), Math.abs(window.DataVelMax), Math.abs(window.DataStarMin), Math.abs(window.DataStarMax));
  const velRange = Math.max(Math.abs(window.DataStarMin), Math.abs(window.DataStarMax));
  const scale = blueToRed(-velRange, velRange);

  const gasImageData = gasCtx.getImageData(0, 0, xmag * window.DataWidth, ymag * window.DataHeight);
  const gasData = gasImageData.data;

  const starCanvas = d3.select('#StarCanvas')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'canvas');

  const starCtx = starCanvas.node().getContext('2d');

  const starImageData = starCtx.getImageData(0, 0, xmag * window.DataWidth, ymag * window.DataHeight);
  const starData = starImageData.data;

  for (let y = 0; y < window.DataHeight; ++y) {
    for (let v = 0; v < ymag; ++v) {
      for (let x = 0; x < window.DataWidth; ++x) {
        for (let u = 0; u < xmag; ++u) {
          // Reverse y so origin is in bottom left (insted of top left)
          let starIndex = (((window.DataHeight - 1 - y) * ymag + v) * (window.DataWidth * xmag) + (x * xmag + u)) * 4;
          // get star map
          const sdx = y * window.DataWidth + x;
          const starVel = window.DataCubeStar[sdx];
          const starColor = d3.rgb(scale(starVel));
          starData[starIndex] = starColor.r;
          starData[++starIndex] = starColor.g;
          starData[++starIndex] = starColor.b;
          starData[++starIndex] = 255;
          // get gas map
          // Reverse y so origin is in bottom left (insted of top left)
          let gasIndex = (((window.DataHeight - 1 - y) * ymag + v) * (window.DataWidth * xmag) + (x * xmag + u)) * 4;
          let gasVel = 0;
          for (let z = 0; z < window.DataDepth; ++z) {
            // average velocity of all lines
            const idx = z * window.DataWidth * window.DataHeight + y * window.DataWidth + x;
            gasVel += window.DataCubeVel[idx];
          }
          gasVel /= window.DataDepth;
          const gasColor = d3.rgb(scale(gasVel));
          gasData[gasIndex] = gasColor.r;
          gasData[++gasIndex] = gasColor.g;
          gasData[++gasIndex] = gasColor.b;
          gasData[++gasIndex] = 255;
        }
      }
    }
  }
  starCtx.putImageData(starImageData, 0, 0);
  gasCtx.putImageData(gasImageData, 0, 0);
  linkCanvases();
  initAudio();
  if (window.Listeners) {
    for (const l of window.Listeners) {
      l.removeListeners();
    }
  } else {
    window.Listeners = [];
  }
  window.Listeners.push(new GasListeners());
  window.Listeners.push(new StarListeners());
  for (const l of window.Listeners) {
    l.addListeners();
  }
  // mainLeap();
});

module.exports = fitsFile;
