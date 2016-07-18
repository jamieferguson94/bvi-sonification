class AudioLine {
  constructor(baseFreq) {
    this.playSound = this.playSound.bind(this);
    this.stopSound = this.stopSound.bind(this);
    this.changeSound = this.changeSound.bind(this);

    this.baseFreq = baseFreq;
    this.GainNode = window.AudioCtx.createGain();
    this.GainNode.connect(window.AudioCtx.destination);
    this.Osc = window.AudioCtx.createOscillator();
    this.Osc.connect(this.GainNode);
    this.Osc.frequency.value = this.baseFreq;
  }

  playSound() {
    this.Osc.start(0);
  }

  stopSound() {
    this.Osc.stop();
  }

  changeSound(ew, vel) {
    if (isFinite(ew)) {
      this.GainNode.gain.value = ew;
    }
    const beta = vel / window.ScaleVel;
    const newFreq = this.baseFreq * Math.sqrt((1 - beta) / (1 + beta));
    if (isFinite(newFreq)) {
      this.Osc.frequency.value = newFreq;
    }
  }
}

class AudioEMLines {
  constructor() {
    this.playSound = this.playSound.bind(this);
    this.stopSound = this.stopSound.bind(this);
    this.changeSound = this.changeSound.bind(this);

    this.Lines = [];
    for (const base of window.BaseFreq) {
      this.Lines.push(new AudioLine(base));
    }
  }

  playSound() {
    for (const line of this.Lines) {
      line.playSound();
    }
  }

  stopSound() {
    for (const line of this.Lines) {
      line.stopSound();
    }
  }

  changeSound(ew, vel) {
    let idx = 0;
    for (const line of this.Lines) {
      line.changeSound(ew[idx], vel[idx]);
      idx++;
    }
  }
}

class AudioStarLine {
  constructor(baseFreq, numFreq = 50) {
    this.playSound = this.playSound.bind(this);
    this.stopSound = this.stopSound.bind(this);
    this.changeSound = this.changeSound.bind(this);

    this.baseFreq = baseFreq;
    this.GainNode = window.AudioCtx.createGain();
    this.GainNode.connect(window.AudioCtx.destination);
    this.Osc = window.AudioCtx.createOscillator();
    this.Osc.connect(this.GainNode);
    this.Osc.frequency.value = this.baseFreq;

    // make a blackbody waveform
    const real = new Float32Array(2 * numFreq);
    const imag = new Float32Array(2 * numFreq);
    let idx = 0;
    // only populate first half of the array since those are the +frequencies
    // there are no -frequencies so keep the back half zero
    for (let i = 0; i < 15; i += 15 / numFreq) {
      // give each frequency a random phase to prevent the waveform from being zero
      // imag[idx] = Math.random() * 2 - 1;
      real[idx] = 0.7011 * i * i * i / (Math.exp(i) - 1);
      idx++;
    }
    // inital vale is 0 in the limit of the function
    real[0] = 0;
    const wave = window.AudioCtx.createPeriodicWave(real, imag);
    this.Osc.setPeriodicWave(wave);
  }

  playSound() {
    this.Osc.start(0);
  }

  stopSound() {
    this.Osc.stop();
  }

  changeSound(ew, vel) {
    if (isFinite(ew)) {
      this.GainNode.gain.value = ew;
    }
    const beta = vel / window.ScaleVel;
    const newFreq = this.baseFreq * Math.sqrt((1 - beta) / (1 + beta));
    if (isFinite(newFreq)) {
      this.Osc.frequency.value = newFreq;
    }
  }
}

module.exports = {
  AudioLine,
  AudioEMLines,
  AudioStarLine,
};
