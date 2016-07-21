function initAudio() {
  window.AudBuffSiz = 4096;
  window.AudAmpScale = 0.8; // 1.3 is good to emphasise "peakiness", 0.5 good to "smooth" the sounds out a bit
  window.AudioCtx = new AudioContext();
  window.AudSampleRate = window.AudioCtx.sampleRate;
  window.AudioBuffer = window.AudioCtx.createBuffer(1, window.AudBuffSiz, window.AudSampleRate);
  window.Analyser = window.AudioCtx.createAnalyser();

  window.currentAudio = undefined;
  window.PlayingSpec = -1;

  window.ScaleVel = 250;
  // line frequency divided by 1e12 Hz.
  /* window.BaseFreq = [
    804.16431867, 616.60316331, 616.85690947, 598.62711262,
    475.71002539, 471.00150511, 457.76829745, 456.72220902,
    455.26569172, 446.25254242, 445.32450683, 804.38008586,
    803.9486672, 754.9545656, 730.84460751, 690.60690624,
    639.62547045, 510.11137996, 339.47736157, 330.49548892,
    314.47860904,
  ]; */
  // line frequency divided by 0.7e12 Hz.
  /* window.BaseFreq = [
    1148.80616953, 880.86166187, 881.22415638, 855.18158946,
    679.58575056, 672.85929301, 653.95471064, 652.4602986,
    650.37955961, 637.50363203, 636.1778669, 1149.11440837,
    1148.498096, 1078.50652229, 1044.06372501, 986.58129463,
    913.75067207, 728.73054279, 484.96765938, 472.13641274,
    449.25515577,
  ]; */
  // line frequency divided by 0.4e12 Hz.
  window.BaseFreq = [
    2010.41079667, 1541.50790827, 1542.14227366, 1496.56778155,
    1189.27506347, 1177.50376277, 1144.42074362, 1141.80552255,
    1138.16422931, 1115.63135606, 1113.31126708, 2010.95021465,
    2009.87166801, 1887.386414, 1827.11151877, 1726.51726561,
    1599.06367613, 1275.27844989, 848.69340392, 826.2387223,
    786.19652261,
  ];
  window.StarBaseFreq = 600; // in Hz
}

module.exports = initAudio;
