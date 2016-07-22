const d3 = require('d3');
const linkCanvases = require('./link_canvases');
const initAudio = require('./init_audio');
const { GasListeners, StarListeners } = require('./create_listeners');
const { blueToRed } = require('./colorbar');
// const mainLeap = require('./leap_position');

window.DataReady = false;

const fitsFile = new window.astro.FITS(`${__dirname}/../data/manga-8138-12704-MAPS-SPX-GAU-MILESHC-NZT_float32.fits`, (dataInput) => {
  // using mpl-5 maps cube
  // get gas velocity info (EMLINE_GVEL)
  const hduGasVel = dataInput.getHDU(34).data;
  const hduGasVelMask = dataInput.getHDU(36).data;
  // get gas flux info (EMLINE_SFLUX)
  const hduGasFlux = dataInput.getHDU(25).data;
  const hduGasFluxMask = dataInput.getHDU(27).data;
  // get star velocity info (STELLAR_VEL)
  const hduStarVel = dataInput.getHDU(16).data;
  const hduStarVelMask = dataInput.getHDU(18).data;
  // get star flux info (SPXL_MFLUX)
  const hduStarFlux = dataInput.getHDU(4).data;
  /* eslint no-underscore-dangle: 0 */
  const DataCubeVelRaw = hduGasVel._getFrame(hduGasVel.buffer, hduGasVel.bitpix, hduGasVel.bzero, hduGasVel.bscale);
  const DataMaskVel = hduGasVelMask._getFrame(hduGasVelMask.buffer, hduGasVelMask.bitpix, hduGasVelMask.bzero, hduGasVelMask.bscale);
  window.DataCubeVel = DataCubeVelRaw.slice();
  const DataCubeFluxRaw = hduGasFlux._getFrame(hduGasFlux.buffer, hduGasFlux.bitpix, hduGasFlux.bzero, hduGasFlux.bscale);
  const DataMaskFlux = hduGasFluxMask._getFrame(hduGasFluxMask.buffer, hduGasFluxMask.bitpix, hduGasFluxMask.bzero, hduGasFluxMask.bscale);
  window.DataCubeFlux = DataCubeFluxRaw.slice();
  for (let i = 0; i < DataCubeVelRaw.length; ++i) {
    // mask value of 0 = good data
    window.DataCubeVel[i] = window.DataCubeVel[i] * (!DataMaskVel[i]);
    window.DataCubeFlux[i] = window.DataCubeFlux[i] * (!DataMaskFlux[i]);
  }
  const DataCubeStarRaw = hduStarVel._getFrame(hduStarVel.buffer, hduStarVel.bitpix, hduStarVel.bzero, hduStarVel.bscale);
  const DataMaskStar = hduStarVelMask._getFrame(hduStarVelMask.buffer, hduStarVelMask.bitpix, hduStarVelMask.bzero, hduStarVelMask.bscale);
  window.DataCubeStar = DataCubeStarRaw.slice();
  const DataCubeStarFluxRaw = hduStarFlux._getFrame(hduStarFlux.buffer, hduStarFlux.bitpix, hduStarFlux.bzero, hduStarFlux.bscale);
  window.DataCubeStarFlux = DataCubeStarFluxRaw.slice();
  for (let i = 0; i < DataCubeStarRaw.length; ++i) {
    window.DataCubeStar[i] = window.DataCubeStar[i] * (!DataMaskStar[i]);
    window.DataCubeStarFlux[i] = window.DataCubeStarFlux[i] * (!DataMaskStar[i]);
  }
  window.DataReady = true;
  window.DataWidth = hduGasVel.width;
  window.DataHeight = hduGasVel.height;
  window.DataDepth = hduGasVel.depth;
  const xmag = 5;
  const ymag = 5;

  let tmpCopy = window.DataCubeVel.slice();
  tmpCopy.sort();
  window.DataVelMin = tmpCopy[0];
  window.DataVelMax = tmpCopy[tmpCopy.length - 1];

  tmpCopy = window.DataCubeFlux.slice();
  tmpCopy.sort();
  window.DataFluxMin = tmpCopy[0];
  window.DataFluxMax = tmpCopy[tmpCopy.length - 1];

  tmpCopy = window.DataCubeStar.slice();
  tmpCopy.sort();
  window.DataStarMin = tmpCopy[0];
  window.DataStarMax = tmpCopy[tmpCopy.length - 1];

  tmpCopy = window.DataCubeStarFlux.slice();
  tmpCopy.sort();
  window.DataStarFluxMin = tmpCopy[0];
  window.DataStarFluxMax = tmpCopy[tmpCopy.length - 1];

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
  }
  window.Listeners = [];
  window.Listeners.push(new GasListeners());
  window.Listeners.push(new StarListeners());
  for (const l of window.Listeners) {
    l.addListeners();
  }
  // mainLeap();
});

module.exports = fitsFile;
