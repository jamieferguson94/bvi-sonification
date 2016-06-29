module.exports = class Audio {
  constructor() {
    this.playSound = this.playSound.bind(this);
    this.stopSound = this.stopSound.bind(this);
    this.equalPowerFade = this.equalPowerFade.bind(this);

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
    const currentTime = this.AudioCtx.currentTime;
    this.GainNode.gain.exponentialRampToValueAtTime(0.0001, currentTime);
    this.GainNode.gain.exponentialRampToValueAtTime(1, currentTime + window.FadeTime);
    // this.equalPowerFade(currentTime, false);
    this.AudioSource.start(0);
  }

  stopSound() {
    // 4 ways to stop the audio
    // way 1: stop the loop (current sound ends)
    // this.AudioSource.loop = false;

    // way 2: cut off the sound
    // this.AudioSource.stop(0);

    // way 3: play a 'blank' sound
    // const buffer = new Array(window.AudBuffSiz).fill(0);
    // this.playSound(buffer);

    // way 4: fade gain to 0
    const currentTime = this.AudioCtx.currentTime;
    this.GainNode.gain.exponentialRampToValueAtTime(1, currentTime);
    this.GainNode.gain.exponentialRampToValueAtTime(0.0001, currentTime + window.FadeTime);
    // this.equalPowerFade(currentTime, true);
    setTimeout(() => (this.AudioSource.stop()), window.FadeTime * 1000);
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
