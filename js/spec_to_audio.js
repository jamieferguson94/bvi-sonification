/* eslint no-unused-vars: 0 */
const fft = require('jsfft');
const { ComplexArray } = require('jsfft/lib/complex_array');
const { datafreq2audiofreq, audiofreq2fftindex } = require('./helper_functions');

function spec2audio(speci) {
  const fftdata = new ComplexArray(window.AudBuffSiz);

  // Initialise to 0
  for (let i = 0; i < window.AudBuffSiz; i++) {
    fftdata.real[i] = 0;
    fftdata.imag[i] = 0;
  }

  // Loop over the input spectrum and map from input "wavelength" to spectral frequency
  for (let i = 0; i < window.DataDepth; i++) {
    const f = datafreq2audiofreq(i);
    const fi = audiofreq2fftindex(f);
    fftdata.real[fi] = fftdata.real[fi] + (window.AudAmplify * Math.pow(window.DataCube[speci + (i * window.DataWidth * window.DataHeight)], window.AudAmpScale));
  }
  /* eslint new-cap: 0 */
  fftdata.InvFFT();

  const tmpBuffer = window.AudioBuffer.getChannelData(0);
  for (let i = 0; i < window.AudBuffSiz; i++) {
    tmpBuffer[i] = fftdata.real[i];
  }
  const rampSize = 2048;
  for (let i = 0; i < rampSize; i++) {
    tmpBuffer[i] *= (i / rampSize);
    tmpBuffer[tmpBuffer.length - i - 1] *= (i / rampSize);
  }

  window.AudioSource.buffer = window.AudioBuffer;
  window.AudioSource.connect(window.AudioCtx.destination);
  window.AudioSource.loop = true;
  window.AudioSource.connect(GainNode);
  // Connect the gain node to the destination.
  window.GainNode.connect(window.AudioCtx.destination);
  window.GainNode.gain.value = 1;
}

module.exports = spec2audio;
