function mouse2data(mcoo) {
  const dcoo = {};
  const rect = window.ImageCnv.getBoundingClientRect();
  dcoo.x = Math.floor((mcoo.x - rect.left - window.ImgOffX) * (window.DataWidth / window.ImageWidth));
  dcoo.y = Math.floor((mcoo.y - rect.top - window.ImgOffY) * (window.DataHeight / window.ImageHeight));
  return dcoo;
}

function data2mouse(dcoo) {
  const mcoo = {};
  const rect = window.ImageCnv.getBoundingClientRect();
  mcoo.x = (dcoo.x / (window.DataWidth / window.ImageWidth)) + window.ImgOffX + rect.left;
  mcoo.y = (dcoo.y / (window.DataHeight / window.ImageHeight)) + window.ImgOffY + rect.top;
  return mcoo;
}

function datafreq2audiofreq(wlen) {
  const frange = window.AudMaxFreq - window.AudMinFreq; // Range of frequencies
  const wdist = wlen / (window.DataDepth - 1); // Distance along spectrum (from the long-wavelength end)
  const freq = window.AudMinFreq + (wdist * frange);
  return freq;
}

function audiofreq2fftindex(freq) {
  const indx = freq * window.AudBuffSiz / window.AudSampleRate;
  return Math.floor(indx);
}

function getDataIdx(x, y, z) {
  const i = x + (y * window.DataWidth) + (z * window.DataWidth * window.DataHeight);
  return i;
}

function getRGBIdx(x, y) {
  const i = x + (y * window.DataWidth);
  return i;
}

module.exports = {
  mouse2data,
  data2mouse,
  datafreq2audiofreq,
  audiofreq2fftindex,
  getDataIdx,
  getRGBIdx,
};
