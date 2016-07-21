const { playGasAudio, changeGasAudio, stopGasAudio, playStarAudio, changeStarAudio, stopStarAudio } = require('./audio');

class GasListeners {
  constructor() {
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.addListeners = this.addListeners.bind(this);
    this.removeListeners = this.removeListeners.bind(this);

    this.ClickStatus = false;
  }

  onMouseDown(evt) {
    if (window.DataReady) {
      this.ClickStatus = true;
      playGasAudio(evt);
    }
  }

  onMouseUp(evt) {
    if (window.DataReady) {
      this.ClickStatus = false;
      stopGasAudio(evt);
      window.cancelAnimationFrame(window.drawVisual);
    }
  }

  onMouseMove(evt) {
    if (window.DataReady) {
      if (this.ClickStatus) {
        changeGasAudio(evt);
      }
    }
  }

  addListeners() {
    window.GasCnv.addEventListener('mousedown', this.onMouseDown, false);
    window.GasCnv.addEventListener('mouseup', this.onMouseUp, false);
    window.GasCnv.addEventListener('mousemove', this.onMouseMove, false);
  }

  removeListeners() {
    window.GasCnv.removeEventListener('mousedown', this.onMouseDown, false);
    window.GasCnv.removeEventListener('mouseup', this.onMouseUp, false);
    window.GasCnv.removeEventListener('mouesmove', this.onMouseMove, false);
  }
}

class StarListeners {
  constructor() {
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.addListeners = this.addListeners.bind(this);
    this.removeListeners = this.removeListeners.bind(this);

    this.ClickStatus = false;
  }

  onMouseDown(evt) {
    if (window.DataReady) {
      this.ClickStatus = true;
      playStarAudio(evt);
    }
  }

  onMouseUp(evt) {
    if (window.DataReady) {
      this.ClickStatus = false;
      stopStarAudio(evt);
      window.cancelAnimationFrame(window.drawVisual);
    }
  }

  onMouseMove(evt) {
    if (window.DataReady) {
      if (this.ClickStatus) {
        changeStarAudio(evt);
      }
    }
  }

  addListeners() {
    window.StarCnv.addEventListener('mousedown', this.onMouseDown, false);
    window.StarCnv.addEventListener('mouseup', this.onMouseUp, false);
    window.StarCnv.addEventListener('mousemove', this.onMouseMove, false);
  }

  removeListeners() {
    window.StarCnv.removeEventListener('mousedown', this.onMouseDown, false);
    window.StarCnv.removeEventListener('mouseup', this.onMouseUp, false);
    window.StarCnv.removeEventListener('mouesmove', this.onMouseMove, false);
  }
}

module.exports = {
  GasListeners,
  StarListeners,
};
