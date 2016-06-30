module.exports = class Audio {
  constructor() {
    this.playSound = this.playSound.bind(this);
    this.stopSound = this.stopSound.bind(this);
    this.equalPowerFade = this.equalPowerFade.bind(this);
    this.exponentialFade = this.exponentialFade.bind(this);
    this.linearFade = this.linearFade.bind(this);

    this.AudioCtx = window.AudioCtx;
    this.GainNode = this.AudioCtx.createGain();
    this.GainNode.connect(this.AudioCtx.destination);
    this.GainNode.gain.value = 0;
    this.AudioBuffer = window.AudioBuffer;
    this.AudioSource = this.AudioCtx.createBufferSource();
    this.AudioSource.connect(this.GainNode);
    if (window.ActiveBuffer) {
      this.ActiveBuffer = 1;
    } else {
      this.ActiveBuffer = 0;
    }
    this.FadeType = window.FadeType;
  }

  playSound(buffer) {
    const tmpBuffer = buffer.slice();
    /* const rampSize = 1024;
    for (let i = 0; i < rampSize; i++) {
      tmpBuffer[i] *= (i / rampSize);
      tmpBuffer[tmpBuffer.length - i - 1] *= (i / rampSize);
    } */
    this.AudioBuffer.copyToChannel(tmpBuffer, this.ActiveBuffer);
    this.AudioSource.buffer = this.AudioBuffer;
    this.AudioSource.loop = true;
    // fade gain to 1
    const currentTime = this.AudioCtx.currentTime;
    switch (this.FadeType) {
      case 'linear':
        this.linearFade(currentTime, false);
        break;
      case 'exponential':
        this.exponentialFade(currentTime, false);
        break;
      case 'equal':
        this.equalPowerFade(currentTime, false);
        break;
      default:
        this.GainNode.gain.value = 1;
    }
    this.AudioSource.start(0);
  }

  stopSound() {
    // fade gain to 0
    const currentTime = this.AudioCtx.currentTime;
    switch (this.FadeType) {
      case 'linear':
        this.linearFade(currentTime, true);
        break;
      case 'exponential':
        this.exponentialFade(currentTime, true);
        break;
      case 'equal':
        this.equalPowerFade(currentTime, true);
        break;
      default:
        this.GainNode.gain.value = 0;
    }
    setTimeout(() => (this.AudioSource.stop()), window.FadeTime * 1000);
  }

  linearFade(currentTime, fadeOut = true) {
    if (fadeOut) {
      this.GainNode.gain.linearRampToValueAtTime(1, currentTime);
      this.GainNode.gain.linearRampToValueAtTime(0, currentTime + window.FadeTime);
    } else {
      this.GainNode.gain.linearRampToValueAtTime(0, currentTime);
      this.GainNode.gain.linearRampToValueAtTime(1, currentTime + window.FadeTime);
    }
  }

  exponentialFade(currentTime, fadeOut = true) {
    if (fadeOut) {
      this.GainNode.gain.exponentialRampToValueAtTime(1, currentTime);
      this.GainNode.gain.exponentialRampToValueAtTime(0.0001, currentTime + window.FadeTime);
    } else {
      this.GainNode.gain.exponentialRampToValueAtTime(0.0001, currentTime);
      this.GainNode.gain.exponentialRampToValueAtTime(1, currentTime + window.FadeTime);
    }
  }

  equalPowerFade(currentTime, fadeOut = true) {
    // semed like a good idea, but makes the clicking worse :-(
    for (let i = 0; i < window.FadeSteps; i++) {
      const percent = (i + 1) / window.FadeSteps;
      let gainValue;
      if (fadeOut) {
        gainValue = Math.cos(percent * 0.5 * Math.PI);
      } else {
        gainValue = Math.cos((1.0 - percent) * 0.5 * Math.PI);
      }
      this.GainNode.gain.setValueAtTime(gainValue, currentTime + (percent * window.FadeTime));
    }
  }
};
