module.exports = class Audio {
  constructor() {
    this.playSound = this.playSound.bind(this);
    this.stopSound = this.stopSound.bind(this);

    this.AudioCtx = window.AudioCtx;
    this.GainNode = this.AudioCtx.createGain();
    this.GainNode.connect(this.AudioCtx.destination);
    this.GainNode.gain.value = 0;
    this.AudioBuffer = window.AudioBuffer;
    this.AudioSource = this.AudioCtx.createBufferSource();
    this.AudioSource.connect(this.GainNode);
  }

  playSound(buffer) {
    const tmpBuffer = buffer.slice();
    const rampSize = 1024;
    for (let i = 0; i < rampSize; i++) {
      tmpBuffer[i] *= (i / rampSize);
      tmpBuffer[tmpBuffer.length - i - 1] *= (i / rampSize);
    }
    this.AudioBuffer.copyToChannel(tmpBuffer, 0);
    this.AudioSource.buffer = this.AudioBuffer;
    this.AudioSource.loop = true;
    const currentTime = this.AudioCtx.currentTime;
    this.GainNode.gain.exponentialRampToValueAtTime(0.0001, currentTime);
    this.GainNode.gain.exponentialRampToValueAtTime(1, currentTime + window.FadeTime);
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
    setTimeout(() => (this.AudioSource.stop(0)), window.FadeTime * 1000);
  }
};
