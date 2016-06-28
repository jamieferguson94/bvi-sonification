const d3 = require('d3');
const linkCanvases = require('./link_canvases');
const initAudio = require('./init_audio');
const createListeners = require('./create_listeners');
// const mainLeap = require('./leap_position');

let hdu;
window.DataReady = false;

const fitsFile = new window.astro.FITS(`${__dirname}/../data/cube4_stck.fits`, (dataInput) => {
  hdu = dataInput.getHDU();
  const fits = hdu.data;
  /* eslint no-underscore-dangle: 0 */
  window.DataCube = fits._getFrame(fits.buffer, fits.bitpix, fits.bzero, fits.bscale);
  window.DataReady = true;
  window.DataWidth = fits.width;
  window.DataHeight = fits.height;
  window.DataDepth = fits.depth;
  const xmag = 3;
  const ymag = 3;

  const tmpCopy = window.DataCube.slice();
  tmpCopy.sort();
  window.DataMin = tmpCopy[0];
  window.DataMax = tmpCopy[tmpCopy.length - 1];

  const width = xmag * window.DataWidth;
  const height = ymag * window.DataHeight;
  const canvas = d3.select('#ImageCanvas')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'canvas');

  const ctx = canvas.node().getContext('2d');

  const scale = {
    r: d3.scale.linear().domain([0, 2e3]).range([0, 255]),
    g: d3.scale.linear().domain([0, 2e3]).range([0, 255]),
    b: d3.scale.linear().domain([0, 2e3]).range([0, 255]),
  };

  const channel = d3.scale.threshold().domain([20, 40]).range(['b', 'g', 'r']);
  const imageData = ctx.getImageData(0, 0, xmag * window.DataWidth, ymag * window.DataHeight);
  const data = imageData.data;

  for (let y = 0; y < window.DataHeight; ++y) {
    for (let v = 0; v < ymag; ++v) {
      for (let x = 0; x < window.DataWidth; ++x) {
        for (let u = 0; u < xmag; ++u) {
          let index = ((y * ymag + v) * (window.DataWidth * xmag) + (x * xmag + u)) * 4;
          const color = { r: 0, g: 0, b: 0 };
          for (let z = 0; z < window.DataDepth; ++z) color[channel(z)] += window.DataCube[z * window.DataWidth * window.DataHeight + y * window.DataWidth + x];
          // flipped colors!!! [hack!]
          data[index] = scale.r(color.b);
          data[++index] = scale.g(color.g);
          data[++index] = scale.b(color.r);
          data[++index] = 255;
        }
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
  linkCanvases();
  initAudio();
  createListeners();
  // mainLeap();
});

module.exports = fitsFile;
