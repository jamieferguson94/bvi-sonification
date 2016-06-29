function initAudio() {
  window.AudBuffSiz = 4096;
  window.AudAmplify = 0.02;
  window.AudAmpScale = 0.8; // 1.3 is good to emphasise "peakiness", 0.5 good to "smooth" the sounds out a bit
  window.AudMinFreq = 30.0;  // In Hz
  window.AudMaxFreq = 900.0;
  window.FadeTime = 0.3; // crossfade time in seconds
  window.FadeSteps = 100; // number of steps to take durring crossfade

  window.AudioCtx = new AudioContext();
  window.AudSampleRate = window.AudioCtx.sampleRate;
  window.AudioBuffer = window.AudioCtx.createBuffer(2, window.AudBuffSiz, window.AudSampleRate);

  window.currentAudio = undefined;
  window.PlayingSpec = -1;
  window.ActiveBuffer = false;
}

module.exports = initAudio;
