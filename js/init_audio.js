function initAudio() {
  window.AudBuffSiz = 4096;
  window.AudAmpScale = 0.8; // 1.3 is good to emphasise "peakiness", 0.5 good to "smooth" the sounds out a bit
  window.AudioCtx = new AudioContext();
  window.AudSampleRate = window.AudioCtx.sampleRate;
  window.AudioBuffer = window.AudioCtx.createBuffer(1, window.AudBuffSiz, window.AudSampleRate);

  window.currentAudio = undefined;
  window.PlayingSpec = -1;

  window.ScaleVel = 250;
  window.BaseFreq = [804.16, 616.60, 604.42, 598.62, 475.71, 471.00, 457.77, 456.72, 455.27, 446.25, 445.32];
  window.StarBaseFreq = 400; // in Hz
}

module.exports = initAudio;
