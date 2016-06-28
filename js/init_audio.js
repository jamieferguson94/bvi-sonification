function initAudio() {
  window.AudBuffSiz = 4096;
  window.AudAmplify = 0.02;
  window.AudAmpScale = 0.8; // 1.3 is good to emphasise "peakiness", 0.5 good to "smooth" the sounds out a bit
  window.AudMinFreq = 30.0;  // In Hz
  window.AudMaxFreq = 900.0;

  window.AudioCtx = new AudioContext();
  window.GainNode = window.AudioCtx.createGain();
  window.GainNode.connect(window.AudioCtx.destination);
  window.GainNode.gain.value = 1;
  window.AudSampleRate = window.AudioCtx.sampleRate;
  window.AudioBuffer = window.AudioCtx.createBuffer(1, window.AudBuffSiz, window.AudSampleRate);

  window.PlayingSpec = -1;
}

module.exports = initAudio;
